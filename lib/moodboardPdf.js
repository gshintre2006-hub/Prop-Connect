import { jsPDF } from "jspdf";
import { storeById } from "./data";

const INK = "#1F3A3F";
const PRIMARY = "#006078";
const MUTE = "#7C9599";

// Load an image URL and return a JPEG data URL + dimensions.
// Returns null on CORS-tainted canvas (e.g. remote stock images) or errors.
function toJpeg(src, max = 1000) {
  return new Promise((resolve) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        const scale = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * scale);
        c.height = Math.round(im.height * scale);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        resolve({ url: c.toDataURL("image/jpeg", 0.78), w: c.width, h: c.height });
      } catch {
        resolve(null);
      }
    };
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

export async function exportMoodboardPdf({ toneLabel, description, images = [], suggestions = [] }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;
  let y = M;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY);
  doc.text("PropConnect · Moodboard", M, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTE);
  doc.text(new Date().toLocaleString(), M, y);
  y += 22;

  if (toneLabel) {
    doc.setFontSize(11);
    doc.setTextColor(INK);
    doc.text(`Mood tone:  ${toneLabel}`, M, y);
    y += 16;
  }
  if (description) {
    doc.setTextColor(INK);
    const lines = doc.splitTextToSize(`Brief:  ${description}`, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 14 + 6;
  }

  if (suggestions.length) {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(PRIMARY);
    doc.text("Suggested props", M, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    suggestions.forEach(({ prop }) => {
      if (y > H - M) { doc.addPage(); y = M; }
      const store = storeById(prop.storeId);
      doc.setTextColor(INK);
      doc.text(`•  ${prop.name}`, M, y);
      doc.setTextColor(MUTE);
      doc.text(`${store?.name || ""}  ·  ₹${prop.price}/day  ·  ${prop.h}×${prop.w}×${prop.d}`, M + 200, y);
      y += 14;
    });
    y += 10;
  }

  // uploaded space photos, two per row
  const embeddable = (
    await Promise.all(images.map((im) => toJpeg(im.url)))
  ).filter(Boolean);

  if (embeddable.length) {
    if (y > H - M - 60) { doc.addPage(); y = M; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(PRIMARY);
    doc.text("Space photos", M, y);
    y += 14;

    const cols = 2;
    const gap = 14;
    const cw = (W - M * 2 - gap * (cols - 1)) / cols;
    let col = 0;
    let rowH = 0;
    embeddable.forEach((img) => {
      const ih = (img.h / img.w) * cw;
      if (col === 0 && y + ih > H - M) { doc.addPage(); y = M; }
      const x = M + col * (cw + gap);
      doc.addImage(img.url, "JPEG", x, y, cw, ih, undefined, "FAST");
      rowH = Math.max(rowH, ih);
      col += 1;
      if (col === cols) { col = 0; y += rowH + gap; rowH = 0; }
    });
  }

  doc.save("propconnect-moodboard.pdf");
}
