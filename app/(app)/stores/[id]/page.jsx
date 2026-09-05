import { notFound } from "next/navigation";
import { STORES } from "@/lib/data";
import { fetchAllVendorStores } from "@/lib/vendor";
import { StoreDetailView } from "@/components/views/StoreDetailView";

// Only the static catalog is pre-rendered at build time; vendor stores
// (unknown ids at build time) render on demand — Next allows params outside
// this list by default.
export function generateStaticParams() {
  return STORES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }) {
  const store =
    STORES.find((s) => s.id === params.id) ||
    (await fetchAllVendorStores()).find((s) => s.id === params.id);
  return { title: store ? `${store.name} · PropConnect` : "Store · PropConnect" };
}

export default async function StorePage({ params }) {
  const store =
    STORES.find((s) => s.id === params.id) ||
    (await fetchAllVendorStores()).find((s) => s.id === params.id);
  if (!store) notFound();
  return <StoreDetailView store={store} />;
}
