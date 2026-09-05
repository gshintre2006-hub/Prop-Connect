import { LifeBuoy } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Support · Vendor Portal" };

export default function SupportPage() {
  return (
    <EmptyPanel
      icon={LifeBuoy}
      title="Support"
      body="Reach the PropConnect team for help with your store or listings."
    />
  );
}
