import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PROPS } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATALOG = PROPS.map(
  (p) => `${p.id} | ${p.name} | ${p.category} | ${p.style} | ${p.material} | ${p.era} | ${p.color} | ${p.available ? "available" : "booked"}`
).join("\n");
const VALID_IDS = new Set(PROPS.map((p) => p.id));

function splitDataUrl(u) {
  const m = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/i.exec(u || "");
  if (!m) return null;
  return { media_type: m[1].toLowerCase() === "image/jpg" ? "image/jpeg" : m[1].toLowerCase(), data: m[3] };
}

export async function POST(request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const tone = String(body.tone || "").slice(0, 40);
  const description = String(body.description || "").slice(0, 600);
  const images = (Array.isArray(body.images) ? body.images : [])
    .slice(0, 4)
    .map(splitDataUrl)
    .filter(Boolean);

  const prompt = [
    "You are a production-design stylist for a film-prop rental marketplace.",
    "Pick the 4-6 props from the catalog that best suit the space — judging style, material, era and colour harmony with the photos and brief.",
    "",
    `Mood tone: ${tone || "(unspecified)"}`,
    `Brief: ${description || "(none)"}`,
    images.length ? `Photos of the actual space: ${images.length} attached.` : "No photos attached.",
    "",
    "Catalog (id | name | category | style | material | era | colour | status):",
    CATALOG,
    "",
    'Reply with ONLY this JSON, no prose: {"picks":[{"id":"<catalog id>","reason":"<max 8 words>"}]}',
    "Use only ids from the catalog. Prefer available props. 4 to 6 picks.",
  ].join("\n");

  try {
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
    const slice = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(slice);

    const picks = (parsed.picks || [])
      .filter((p) => p && VALID_IDS.has(p.id))
      .slice(0, 6)
      .map((p) => ({ id: p.id, reason: String(p.reason || "").slice(0, 60) }));

    if (!picks.length) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ picks, model: msg.model });
  } catch (err) {
    return NextResponse.json({ error: "failed", detail: String(err?.message || err).slice(0, 200) }, { status: 502 });
  }
}
