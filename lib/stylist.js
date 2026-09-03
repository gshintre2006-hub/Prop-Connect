import { PROPS } from "./data";

/* Lightweight "AI stylist" — matches the network's props to a mood tone + a
   free-text description of the space. Swap `suggestProps` for a real Claude
   API call later; the shape ({ prop, reason }) is all the UI depends on. */

export const MOOD_TONES = [
  { key: "warm", label: "Warm & inviting" },
  { key: "minimal", label: "Minimal" },
  { key: "vintage", label: "Vintage" },
  { key: "industrial", label: "Industrial" },
  { key: "bohemian", label: "Bohemian" },
  { key: "luxe", label: "Luxe" },
  { key: "rustic", label: "Rustic" },
  { key: "period", label: "Period / era" },
];

const TONE_HINTS = {
  warm: ["teak", "leather", "brass", "oxblood", "honey", "traditional", "colonial", "wood", "rattan"],
  minimal: ["matte", "black", "console", "mid-century", "steel", "typewriter", "globe"],
  vintage: ["vintage", "1940", "1950", "1960", "1970", "weathered", "antique", "retro", "trunk"],
  industrial: ["iron", "reclaimed", "matte black", "industrial", "pinewood", "steel", "crate"],
  bohemian: ["rattan", "cane", "peacock", "natural", "bohemian", "beige", "lantern"],
  luxe: ["crystal", "chandelier", "brass", "polished", "royal", "gold", "hookah"],
  rustic: ["copper", "hammered", "pinewood", "weathered", "rustic", "wrought", "bench"],
  period: ["period", "mughal", "hookah", "colonial", "1940", "1950", "temple", "bell", "ammunition", "military", "typewriter"],
};

const hay = (p) =>
  [p.name, p.category, p.material, p.style, p.era, p.finish, p.color].join(" ").toLowerCase();

export function suggestProps({ tone, description = "", imageHints = [], limit = 6 }) {
  const hints = TONE_HINTS[tone] || [];
  // description words + any keywords lifted from uploaded photo filenames
  const raw = (description + " " + imageHints.join(" ")).toLowerCase();
  const words = (raw.match(/[a-z]{4,}/g) || []).filter(
    (w) => !["with", "that", "this", "room", "have", "need", "want", "space", "some", "look", "image", "photo", "jpeg", "png", "copy", "final", "screenshot"].includes(w)
  );

  const scored = PROPS.map((p) => {
    const h = hay(p);
    let score = p.available ? 0.5 : 0;
    let reason = "";
    hints.forEach((k) => {
      if (h.includes(k)) { score += 2; if (!reason) reason = k; }
    });
    words.forEach((w) => {
      if (h.includes(w)) { score += 3; reason = w; }
    });
    return { prop: p, score, reason };
  })
    .filter((x) => x.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length === 0) {
    return PROPS.filter((p) => p.available).slice(0, limit).map((p) => ({ prop: p, reason: "" }));
  }
  return scored;
}

export function stylistIntro({ tone, description, count, photos = 0 }) {
  const label = (MOOD_TONES.find((t) => t.key === tone) || {}).label || "that";
  const desc = description ? ` around "${description.trim().slice(0, 70)}"` : "";
  const seen = photos ? ` I looked at your ${photos} photo${photos === 1 ? "" : "s"}, the ${label.toLowerCase()} tone${description ? " and your brief" : ""}.` : "";
  return `For a ${label.toLowerCase()} space${desc}, here are ${count} props from partner stores that would fit.${seen} Add any to your board.`;
}
