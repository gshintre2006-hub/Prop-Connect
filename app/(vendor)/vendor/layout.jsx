import { C } from "@/lib/tokens";

export const metadata = { title: "PropConnect — Vendor Portal" };

export default function VendorLayout({ children }) {
  return <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>{children}</div>;
}
