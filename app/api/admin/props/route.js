import { NextResponse } from "next/server";
import { resolveAdmin } from "@/lib/admin";
import { getServiceRoleClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDITABLE = ["name", "category", "status", "qty", "price", "deposit", "available", "description"];

async function guard() {
  const gate = await resolveAdmin();
  if (!gate.ok) return { res: NextResponse.json({ error: gate.error }, { status: gate.status }) };
  const sb = getServiceRoleClient();
  if (!sb) return { res: NextResponse.json({ error: "Service role key not set on the server." }, { status: 501 }) };
  return { sb };
}

export async function GET(request) {
  const { sb, res } = await guard();
  if (res) return res;

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const storeId = url.searchParams.get("storeId") || "";

  let query = sb.from("vendor_props").select("*").order("created_at", { ascending: false }).limit(1000);
  if (storeId) query = query.eq("store_id", storeId);

  const [{ data: props, error }, { data: stores }] = await Promise.all([
    query,
    sb.from("vendor_stores").select("id,name"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const storeName = {};
  (stores || []).forEach((s) => { storeName[s.id] = s.name; });

  let rows = (props || []).map((p) => ({ ...p, storeName: storeName[p.store_id] || "—" }));
  if (q) {
    rows = rows.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.storeName?.toLowerCase().includes(q)
    );
  }
  return NextResponse.json({ props: rows, stores: stores || [] });
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
  if ("status" in patch) patch.available = patch.status === "available";
  patch.updated_at = new Date().toISOString();

  const { error } = await sb.from("vendor_props").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const { sb, res } = await guard();
  if (res) return res;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Pass ?id=" }, { status: 400 });

  const { error } = await sb.from("vendor_props").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
