import { CalendarCheck } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Availability · Vendor Portal" };

export default function AvailabilityPage() {
  return (
    <EmptyPanel
      icon={CalendarCheck}
      title="Availability"
      body="Update prop status in one place — available, reserved, out on rent, maintenance or hidden. For now, change status per prop from Inventory → Edit."
    />
  );
}
