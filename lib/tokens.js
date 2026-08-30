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

export const img = (kw, w = 700, h = 520) =>
  `https://loremflickr.com/${w}/${h}/${kw}?lock=${encodeURIComponent(kw)}`;
