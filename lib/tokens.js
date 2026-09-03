/* ---------------------------------------------------------------------- */
/*  PALETTE / TOKENS                                                       */
/* ---------------------------------------------------------------------- */
export const C = {
  primary: "#006078",
  primaryTint: "#e6eef0",
  secondary: "#82BAC4",
  bg: "#FAEFED",
  accent: "#FFD4D1",
  highlight: "#E37C78",
  ink: "#1F3A3F",
  line: "#E7D9D6",
  white: "#FFFFFF",
};

const seedFrom = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 100000;
};

/**
 * Turn a keyword string ("chesterfield,leather,sofa") into a stable image URL
 * that actually depicts the subject — generated on demand by pollinations.ai
 * and CDN-cached per seed. Same call signature as before.
 */
export const img = (kw, w = 700, h = 520) => {
  const subject = String(kw).replace(/[,_]+/g, " ").replace(/\s+/g, " ").trim();
  const prompt = `${subject}, product photograph, studio lighting, plain neutral background, sharp focus, high detail`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seedFrom(kw)}`;
};
