import { notFound } from "next/navigation";
import { PROPS } from "@/lib/data";
import { fetchAllVendorProps } from "@/lib/vendor";
import { PropDetailView } from "@/components/views/PropDetailView";

// Only the static catalog is pre-rendered at build time; vendor-added props
// (unknown ids at build time) render on demand — Next allows params outside
// this list by default.
export function generateStaticParams() {
  return PROPS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const prop =
    PROPS.find((p) => p.id === params.id) ||
    (await fetchAllVendorProps()).find((p) => p.id === params.id);
  return { title: prop ? `${prop.name} · PropConnect` : "Prop · PropConnect" };
}

export default async function PropPage({ params }) {
  const prop =
    PROPS.find((p) => p.id === params.id) ||
    (await fetchAllVendorProps()).find((p) => p.id === params.id);
  if (!prop) notFound();
  return <PropDetailView prop={prop} />;
}
