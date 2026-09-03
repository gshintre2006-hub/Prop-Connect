// One-off image prep:
//   public/logo.jpg  ->  public/logo.png       (transparent, tight-cropped full lockup)
//                    ->  public/logo-mark.png  (just the PC monogram, no wordmark)
// Run: node scripts/process-logo.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "public", "logo.jpg");
const FULL = path.join(root, "public", "logo.png");
const MARK = path.join(root, "public", "logo-mark.png");

const TOLERANCE = 42; // colour distance from bg that still counts as background

// --- key out the cream background -> transparent RGBA buffer ---
const base = sharp(SRC).ensureAlpha();
const { width, height } = await base.metadata();
const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;

const corners = [
  0,
  (width - 1) * ch,
  (height - 1) * width * ch,
  ((height - 1) * width + (width - 1)) * ch,
];
let br = 0, bg = 0, bb = 0;
for (const c of corners) { br += data[c]; bg += data[c + 1]; bb += data[c + 2]; }
br /= 4; bg /= 4; bb /= 4;

for (let i = 0; i < data.length; i += ch) {
  const dr = data[i] - br, dg = data[i + 1] - bg, db = data[i + 2] - bb;
  if (Math.sqrt(dr * dr + dg * dg + db * db) <= TOLERANCE) data[i + 3] = 0;
}

const W = info.width, H = info.height;
const keyed = () => sharp(Buffer.from(data), { raw: { width: W, height: H, channels: ch } });

// --- full lockup ---
await keyed().png().trim({ threshold: 1 }).toFile(FULL);

// --- monogram only: crop the top 56% (icon sits above the wordmark), trim,
//     then add a transparent margin so nothing touches the edge (was clipping
//     at the bottom in the nav) ---
const topBuf = await keyed()
  .extract({ left: 0, top: 0, width: W, height: Math.round(H * 0.56) })
  .png()
  .toBuffer();
const trimmed = await sharp(topBuf).trim({ threshold: 1 }).toBuffer();
const tm = await sharp(trimmed).metadata();
const pad = Math.round(Math.max(tm.width, tm.height) * 0.09);
await sharp(trimmed)
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(MARK);

const [f, m] = await Promise.all([sharp(FULL).metadata(), sharp(MARK).metadata()]);
console.log(`logo.png ${f.width}x${f.height} · logo-mark.png ${m.width}x${m.height}`);
