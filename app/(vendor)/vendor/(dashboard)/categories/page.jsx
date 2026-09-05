import { Network } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Categories · Vendor Portal" };

export default function CategoriesPage() {
  return (
    <EmptyPanel
      icon={Network}
      title="Categories"
      body="Organise props into categories and sub categories. Changes sync to PropConnect automatically."
    />
  );
}
