import { C } from "@/lib/tokens";

export const metadata = { title: "PropConnect — Admin Console" };

export default function AdminLayout({ children }) {
  return <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>{children}</div>;
}
