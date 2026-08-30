import { BrowseView } from "@/components/views/BrowseView";

export const metadata = { title: "Browse props · PropConnect" };

export default function BrowsePage({ searchParams }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  // key forces a fresh mount (and filter reset) when the search term changes
  return <BrowseView key={q} initialQuery={q} />;
}
