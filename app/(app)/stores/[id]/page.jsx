import { notFound } from "next/navigation";
import { STORES } from "@/lib/data";
import { StoreDetailView } from "@/components/views/StoreDetailView";

export function generateStaticParams() {
  return STORES.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }) {
  const store = STORES.find((s) => s.id === params.id);
  return { title: store ? `${store.name} · PropConnect` : "Store · PropConnect" };
}

export default function StorePage({ params }) {
  const store = STORES.find((s) => s.id === params.id);
  if (!store) notFound();
  return <StoreDetailView store={store} />;
}
