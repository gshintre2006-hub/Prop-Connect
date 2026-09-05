import { NextResponse } from "next/server";
import { resolveAdmin } from "@/lib/admin";
import { getServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service";

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

  const [storesCount, propsCount, recentStores, recentProps] = await Promise.all([
    sb.from("vendor_stores").select("id", { count: "exact", head: true }),
    sb.from("vendor_props").select("id", { count: "exact", head: true }),
    sb.from("vendor_stores").select("id,name,location,created_at").order("created_at", { ascending: false }).limit(5),
    sb.from("vendor_props").select("id,name,category,status,created_at,store_id").order("created_at", { ascending: false }).limit(6),
  ]);

  // User count — try a cheap exact count on the auth schema, fall back to the
  // Admin API if this Postgres role can't see auth.users directly.
  let usersTotal = 0;
  try {
    const { count, error } = await sb.schema("auth").from("users").select("id", { count: "exact", head: true });
    if (error) throw error;
    usersTotal = count ?? 0;
  } catch {
    const { data } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
    usersTotal = data?.users?.length ?? 0;
  }

  // Status breakdown for vendor props (small table — fetch statuses and tally).
  const { data: statusRows } = await sb.from("vendor_props").select("status");
  const statusBreakdown = {};
  (statusRows || []).forEach((r) => {
    const k = r.status || "available";
    statusBreakdown[k] = (statusBreakdown[k] || 0) + 1;
  });

  return NextResponse.json({
    counts: {
      stores: storesCount.count ?? 0,
      props: propsCount.count ?? 0,
      users: usersTotal,
    },
    statusBreakdown,
    recentStores: recentStores.data || [],
    recentProps: recentProps.data || [],
    serviceRole: isServiceRoleConfigured,
  });
}
