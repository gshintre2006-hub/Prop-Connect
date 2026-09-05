import { NextResponse } from "next/server";
import { resolveAdmin } from "@/lib/admin";
import { getServiceRoleClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDITABLE = [
  "name", "location", "address", "phone", "whatsapp", "email", "website",
  "hours", "description", "delivery_areas", "lat", "lng",
];

async function guard() {
  const gate = await resolveAdmin();
  if (!gate.ok) return { res: NextResponse.json({ error: gate.error }, { status: gate.status }) };
  const sb = getServiceRoleClient();
  if (!sb) return { res: NextResponse.json({ error: "Service role key not set on the server." }, { status: 501 }) };
  return { sb };
}

export async function GET() {
  const { sb, res } = await guard();
  if (res) return res;

  const [{ data: stores, error }, { data: propRows }] = await Promise.all([
    sb.from("vendor_stores").select("*").order("created_at", { ascending: false }),
    sb.from("vendor_props").select("store_id,status"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const propCounts = {};
  (propRows || []).forEach((r) => {
    propCounts[r.store_id] = (propCounts[r.store_id] || 0) + 1;
  });

  return NextResponse.json({
    stores: (stores || []).map((s) => ({ ...s, propCount: propCounts[s.id] || 0 })),
  });
}

export async function PATCH(request) {
  const { sb, res } = await guard();
  if (res) return res;

  const body = await request.json().catch(() => null);
  if (!body?.id || typeof body.fields !== "object") {
    return NextResponse.json({ error: "Send { id, fields }." }, { status: 400 });
  }
  const patch = {};
  for (const k of EDITABLE) if (k in body.fields) patch[k] = body.fields[k];
  patch.updated_at = new Date().toISOString();

  const { error } = await sb.from("vendor_stores").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const { sb, res } = await guard();
  if (res) return res;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Pass ?id=" }, { status: 400 });

  // vendor_props has ON DELETE CASCADE, so its rows go with the store.
  const { error } = await sb.from("vendor_stores").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
