import { notFound } from "next/navigation";
import { PROPS } from "@/lib/data";
import { PropDetailView } from "@/components/views/PropDetailView";

export function generateStaticParams() {
  return PROPS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const prop = PROPS.find((p) => p.id === params.id);
  return { title: prop ? `${prop.name} · PropConnect` : "Prop · PropConnect" };
}

export default function PropPage({ params }) {
  const prop = PROPS.find((p) => p.id === params.id);
  if (!prop) notFound();
  return <PropDetailView prop={prop} />;
}
