import { img } from "./tokens";
import { getAnonSupabaseClient } from "./supabase/anon";

/* ---------------------------------------------------------------------- */
/*  Vendor Portal <-> PropConnect catalog bridge.                          */
/*                                                                          */
/*  Vendors manage their own inventory in Supabase tables `vendor_stores`  */
/*  and `vendor_props` (see supabase/vendor-schema.sql). These helpers map */
/*  those rows onto the exact same shape as the static STORES/PROPS mock   */
/*  data, so every consumer-app view can merge them in with a plain array  */
/*  spread — no per-view branching on "is this a vendor item".            */
/* ---------------------------------------------------------------------- */

const genId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function mapVendorStoreRow(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location || row.address || "",
    address: row.address || "",
    phone: row.phone || "",
    whatsapp: row.whatsapp || (row.phone || "").replace(/\D/g, ""),
    email: row.email || "",
    website: row.website || "",
    hours: row.hours || "",
    description: row.description || "",
    deliveryAreas: row.delivery_areas || "",
    totalProps: 0, // recomputed after merge, once vendor_props is known
    rating: 5,
    lat: row.lat ?? null,
    lng: row.lng ?? null,
    logo: row.logo || img(`${row.name}, store logo`, 200, 200),
    photos: row.photos?.length ? row.photos : [img(`${row.name}, prop rental storefront`, 700, 460)],
    vendor: true,
  };
}

export function mapVendorPropRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    material: row.material || "",
    style: row.style || "",
    era: row.era || "",
    finish: row.finish || "",
    color: row.color || "",
    h: row.h || "",
    w: row.w || "",
    d: row.d || "",
    seat: row.seat || undefined,
    weight: row.weight || "",
    price: Number(row.price) || 0,
    deposit: Number(row.deposit) || 0,
    qty: Number(row.qty) || 0,
    available: row.status ? row.status === "available" : Boolean(row.available),
    status: row.status || (row.available ? "available" : "hidden"),
    storeId: row.store_id,
    img: row.img || img(`${row.name}, ${row.era || ""} ${row.style || ""} ${row.material || ""}, ${row.color || ""}`),
    vendor: true,
  };
}

/** Public read: every vendor store, for merging into the consumer STORES list. */
export async function fetchAllVendorStores() {
  const sb = getAnonSupabaseClient();
  if (!sb) return [];
  const { data, error } = await sb.from("vendor_stores").select("*");
  if (error || !data) return [];
  return data.map(mapVendorStoreRow);
}

/** Public read: every vendor prop, for merging into the consumer PROPS list. */
export async function fetchAllVendorProps() {
  const sb = getAnonSupabaseClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("vendor_props")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapVendorPropRow);
}

/* ------------------------- Vendor-portal-only CRUD ----------------------- */
/* These take the browser Supabase client (with the signed-in vendor's       */
/* session) so RLS scopes every write to that vendor's own store.            */

export async function fetchMyStore(supabase, userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("vendor_stores")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapVendorStoreRow({ ...data, _raw: data });
}

export async function createMyStore(supabase, userId, fields) {
  const id = genId("v-store");
  const { error } = await supabase.from("vendor_stores").insert({
    id,
    owner_id: userId,
    name: fields.name,
    location: fields.location,
    address: fields.address,
    phone: fields.phone,
    whatsapp: fields.whatsapp,
    email: fields.email,
    website: fields.website,
    hours: fields.hours,
    description: fields.description,
    delivery_areas: fields.deliveryAreas,
  });
  if (error) throw error;
  return id;
}

export async function updateMyStore(supabase, storeId, fields) {
  const { error } = await supabase
    .from("vendor_stores")
    .update({
      name: fields.name,
      location: fields.location,
      address: fields.address,
      phone: fields.phone,
      whatsapp: fields.whatsapp,
      email: fields.email,
      website: fields.website,
      hours: fields.hours,
      description: fields.description,
      delivery_areas: fields.deliveryAreas,
      updated_at: new Date().toISOString(),
    })
    .eq("id", storeId);
  if (error) throw error;
}

export async function fetchMyProps(supabase, storeId) {
  if (!supabase || !storeId) return [];
  const { data, error } = await supabase
    .from("vendor_props")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function fetchMyProp(supabase, storeId, propId) {
  if (!supabase || !storeId || !propId) return null;
  const { data, error } = await supabase
    .from("vendor_props")
    .select("*")
    .eq("store_id", storeId)
    .eq("id", propId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function createMyProp(supabase, storeId, fields) {
  const id = genId("v-prop");
  const generatedImg = img(`${fields.name}, ${fields.era || ""} ${fields.style || ""} ${fields.material || ""}, ${fields.color || ""}`);
  const { error } = await supabase.from("vendor_props").insert({
    id,
    store_id: storeId,
    name: fields.name,
    category: fields.category,
    sub_category: fields.subCategory,
    keywords: fields.keywords,
    tags: fields.tags,
    description: fields.description,
    material: fields.material,
    style: fields.style,
    era: fields.era,
    finish: fields.finish,
    color: fields.color,
    condition: fields.condition,
    h: fields.h,
    w: fields.w,
    d: fields.d,
    seat: fields.seat || null,
    weight: fields.weight,
    price: Number(fields.price) || 0,
    deposit: Number(fields.deposit) || 0,
    replacement_value: fields.replacementValue ? Number(fields.replacementValue) : null,
    min_days: fields.minDays ? Number(fields.minDays) : 1,
    max_days: fields.maxDays ? Number(fields.maxDays) : 30,
    qty: Number(fields.qty) || 0,
    available: fields.status === "available",
    status: fields.status || "available",
    img: generatedImg,
  });
  if (error) throw error;
  return id;
}

export async function updateMyProp(supabase, propId, fields) {
  const generatedImg = img(`${fields.name}, ${fields.era || ""} ${fields.style || ""} ${fields.material || ""}, ${fields.color || ""}`);
  const { error } = await supabase
    .from("vendor_props")
    .update({
      name: fields.name,
      category: fields.category,
      sub_category: fields.subCategory,
      keywords: fields.keywords,
      tags: fields.tags,
      description: fields.description,
      material: fields.material,
      style: fields.style,
      era: fields.era,
      finish: fields.finish,
      color: fields.color,
      condition: fields.condition,
      h: fields.h,
      w: fields.w,
      d: fields.d,
      seat: fields.seat || null,
      weight: fields.weight,
      price: Number(fields.price) || 0,
      deposit: Number(fields.deposit) || 0,
      replacement_value: fields.replacementValue ? Number(fields.replacementValue) : null,
      min_days: fields.minDays ? Number(fields.minDays) : 1,
      max_days: fields.maxDays ? Number(fields.maxDays) : 30,
      qty: Number(fields.qty) || 0,
      available: fields.status === "available",
      status: fields.status || "available",
      img: generatedImg,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propId);
  if (error) throw error;
}

export async function deleteMyProp(supabase, propId) {
  const { error } = await supabase.from("vendor_props").delete().eq("id", propId);
  if (error) throw error;
}
