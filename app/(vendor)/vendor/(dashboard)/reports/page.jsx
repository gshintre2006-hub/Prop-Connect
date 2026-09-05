import { BarChart3 } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Reports · Vendor Portal" };

export default function ReportsPage() {
  return (
    <EmptyPanel
      icon={BarChart3}
      title="Reports"
      body="Simple, table-based reports: inventory count, most viewed props, unavailable props and low stock."
    />
  );
}
