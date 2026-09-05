import { Settings } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Settings · Vendor Portal" };

export default function SettingsPage() {
  return (
    <EmptyPanel
      icon={Settings}
      title="Settings"
      body="Manage your account, notification preferences and access."
    />
  );
}
