import { Upload } from "lucide-react";
import { EmptyPanel } from "@/components/vendor/EmptyPanel";

export const metadata = { title: "Bulk upload · Vendor Portal" };

export default function BulkUploadPage() {
  return (
    <EmptyPanel
      icon={Upload}
      title="Bulk upload"
      body="Import props in bulk from a CSV or Excel template, preview the data and fix errors before anything goes live."
    />
  );
}
