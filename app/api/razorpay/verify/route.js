import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

// Verifies the signature Razorpay Checkout returns on a successful payment.
export async function POST(request) {
  if (!KEY_SECRET) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await request.json().catch(() => ({}));

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  let ok = false;
  try {
    ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  } catch {
    ok = false;
  }

  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
