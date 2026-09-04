import { NextResponse } from "next/server";

export const runtime = "nodejs";

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

// Creates a Razorpay order the browser can pay against.
export async function POST(request) {
  if (!KEY_ID || !KEY_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const body = await request.json().catch(() => ({}));
  const amountPaise = Math.round(Number(body.amount) * 100);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return NextResponse.json({ error: "bad_amount" }, { status: 400 });
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: (body.receipt || `pc_${Date.now()}`).slice(0, 40),
      notes: body.notes && typeof body.notes === "object" ? body.notes : {},
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.description || "razorpay_error" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId: KEY_ID,
  });
}
