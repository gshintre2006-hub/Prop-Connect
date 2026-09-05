import { NextResponse } from "next/server";
import { resolveAdmin } from "@/lib/admin";
import { getServiceRoleClient } from "@/lib/supabase/service";
import { isAdminEmail } from "@/lib/adminEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await resolveAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const sb = getServiceRoleClient();
  if (!sb) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY isn't set on the server." },
      { status: 501 }
    );
  }

  // Pull up to 2000 users (10 pages of 200).
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    all.push(...(data?.users || []));
    if (!data?.users?.length || data.users.length < 200) break;
  }

  const { data: stores } = await sb.from("vendor_stores").select("id,name,owner_id");
  const storeByOwner = {};
  (stores || []).forEach((s) => { storeByOwner[s.owner_id] = s; });

  const users = all
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name || u.user_metadata?.name || "",
      provider: u.app_metadata?.provider || "email",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      isAdmin: isAdminEmail(u.email),
      store: storeByOwner[u.id] ? { id: storeByOwner[u.id].id, name: storeByOwner[u.id].name } : null,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return NextResponse.json({ users, total: users.length });
}
