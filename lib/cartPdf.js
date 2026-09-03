import { jsPDF } from "jspdf";
import { storeById } from "./data";

const INK = "#1F3A3F";
const PRIMARY = "#006078";
const MUTE = "#7C9599";
const LINE = "#E7D9D6";

const rupee = (n) => "Rs " + Number(n).toLocaleString("en-IN");

export function exportCartPdf({ cart, deliveryFee = 600 }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 44;
  let y = M;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(PRIMARY);
  doc.text("PropConnect · Rental list", M, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.text(new Date().toLocaleString(), M, y);
  y += 24;

  // table header
  doc.setDrawColor(LINE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.text("ITEM", M, y);
  doc.text("STORE", M + 210, y);
  doc.text("QTY", W - M - 150, y, { align: "right" });
  doc.text("Rs/DAY", W - M - 80, y, { align: "right" });
  doc.text("LINE", W - M, y, { align: "right" });
  y += 6;
  doc.line(M, y, W - M, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let subtotal = 0;
  let deposit = 0;

  cart.forEach((i) => {
    if (y > H - M - 90) { doc.addPage(); y = M; }
    const store = storeById(i.storeId);
    subtotal += i.price * i.qty;
    deposit += i.deposit * i.qty;
    doc.setTextColor(INK);
    doc.text(doc.splitTextToSize(i.name, 190), M, y);
    doc.setTextColor(MUTE);
    doc.text(doc.splitTextToSize(store?.name || "", 140), M + 210, y);
    doc.setTextColor(INK);
    doc.text(String(i.qty), W - M - 150, y, { align: "right" });
    doc.text(rupee(i.price), W - M - 80, y, { align: "right" });
    doc.text(rupee(i.price * i.qty), W - M, y, { align: "right" });
    y += 20;
  });

  y += 6;
  doc.line(M, y, W - M, y);
  y += 18;

  const total = subtotal + deposit + deliveryFee;
  const row = (label, value, bold) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(bold ? PRIMARY : MUTE);
    doc.text(label, W - M - 200, y);
    doc.setTextColor(bold ? PRIMARY : INK);
    doc.text(rupee(value), W - M, y, { align: "right" });
    y += bold ? 20 : 16;
  };
  row("Rental subtotal / day", subtotal);
  row("Refundable deposit", deposit);
  row("Delivery & handling", deliveryFee);
  y += 4;
  doc.line(W - M - 200, y, W - M, y);
  y += 16;
  row("Estimated total", total, true);

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(MUTE);
  doc.text("Deposit is refunded after items are returned in original condition. Shared from PropConnect.", M, y);

  doc.save("propconnect-rental-list.pdf");
}
