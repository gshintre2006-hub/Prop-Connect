import { NextResponse } from "next/server";
import { PROPS } from "@/lib/data";
import { fetchAllVendorProps } from "@/lib/vendor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function splitDataUrl(u) {
  const m = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/i.exec(u || "");
  if (!m) return null;
  const mt = m[1].toLowerCase() === "image/jpg" ? "image/jpeg" : m[1].toLowerCase();
  return { media_type: mt, data: m[3] };
}

function jsonSlice(text) {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s < 0 || e < s) throw new Error("no json in response");
  return JSON.parse(text.slice(s, e + 1));
}

/* ---- Gemini (Google AI Studio, REST — no SDK) ---- */
async function askGemini({ key, prompt, images }) {
  const parts = [{ text: prompt }];
  for (const im of images) {
    parts.push({ inline_data: { mime_type: im.media_type, data: im.data } });
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `gemini ${res.status}`);
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("");
  return { picks: jsonSlice(text).picks || [], model: GEMINI_MODEL };
}

/* ---- Claude fallback (only if GEMINI_API_KEY is absent) ---- */
async function askClaude({ key, prompt, images }) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1500,
    output_config: { effort: "low" },
    messages: [
      {
        role: "user",
        content: [
          ...images.map((im) => ({
            type: "image",
            source: { type: "base64", media_type: im.media_type, data: im.data },
          })),
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  const text = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return { picks: jsonSlice(text).picks || [], model: msg.model };
}

export async function POST(request) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  if (!geminiKey && !claudeKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const catalogProps = [...PROPS, ...(await fetchAllVendorProps())];
  const CATALOG = catalogProps
    .map((p) => `${p.id} | ${p.name} | ${p.category} | ${p.style} | ${p.material} | ${p.era} | ${p.color} | ${p.available ? "available" : "booked"}`)
    .join("\n");
  const VALID_IDS = new Set(catalogProps.map((p) => p.id));

  const tone = String(body.tone || "").slice(0, 40);
  const description = String(body.description || "").slice(0, 600);
  const images = (Array.isArray(body.images) ? body.images : [])
    .slice(0, 4)
    .map(splitDataUrl)
    .filter(Boolean);

  const prompt = [
    "You are a production-design stylist for a film-prop rental marketplace.",
    "Pick the 4-6 props from the catalog that best suit the space — judging style, material, era and colour harmony with the photos and the brief.",
    "",
    `Mood tone: ${tone || "(unspecified)"}`,
    `Brief: ${description || "(none)"}`,
    images.length ? `Photos of the actual space: ${images.length} attached — look at them.` : "No photos attached.",
    "",
    "Catalog (id | name | category | style | material | era | colour | status):",
    CATALOG,
    "",
    'Reply with ONLY this JSON: {"picks":[{"id":"<catalog id>","reason":"<max 8 words>"}]}',
    "Use only ids from the catalog. Prefer available props. 4 to 6 picks.",
  ].join("\n");

  try {
    const provider = geminiKey ? "gemini" : "claude";
    const out = geminiKey
      ? await askGemini({ key: geminiKey, prompt, images })
      : await askClaude({ key: claudeKey, prompt, images });

    const picks = (out.picks || [])
      .filter((p) => p && VALID_IDS.has(p.id))
      .slice(0, 6)
      .map((p) => ({ id: p.id, reason: String(p.reason || "").slice(0, 60) }));

    if (!picks.length) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ picks, provider, model: out.model });
  } catch (err) {
    return NextResponse.json(
      { error: "failed", detail: String(err?.message || err).slice(0, 200) },
      { status: 502 }
    );
  }
}
