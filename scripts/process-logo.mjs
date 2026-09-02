// One-off: turn public/logo.jpg (cream background) into a transparent,
// tightly-cropped public/logo.png.  Run: node scripts/process-logo.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "public", "logo.jpg");
const OUT = path.join(root, "public", "logo.png");

// How far a pixel can be from the sampled background colour and still count
// as background (0-255 per channel, Euclidean).
const TOLERANCE = 42;

const img = sharp(SRC).ensureAlpha();
const { width, height } = await img.metadata();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const ch = info.channels; // 4 (RGBA)

// Sample background from the four corners and average them.
const corners = [
  0,
  (width - 1) * ch,
  (height - 1) * width * ch,
  ((height - 1) * width + (width - 1)) * ch,
];
let br = 0, bg = 0, bb = 0;
for (const c of corners) { br += data[c]; bg += data[c + 1]; bb += data[c + 2]; }
br /= 4; bg /= 4; bb /= 4;

let cleared = 0;
for (let i = 0; i < data.length; i += ch) {
  const dr = data[i] - br, dg = data[i + 1] - bg, db = data[i + 2] - bb;
  if (Math.sqrt(dr * dr + dg * dg + db * db) <= TOLERANCE) {
    data[i + 3] = 0; // fully transparent
    cleared++;
  }
}

await sharp(data, { raw: { width, height, channels: ch } })
  .png()
  .trim({ threshold: 1 }) // crop away the now-transparent margin
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(
  `bg ≈ rgb(${br.toFixed(0)},${bg.toFixed(0)},${bb.toFixed(0)}) · ` +
  `cleared ${(cleared / (width * height) * 100).toFixed(1)}% of pixels · ` +
  `output ${meta.width}x${meta.height} -> public/logo.png`
);
