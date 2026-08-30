import { TopNav } from "@/components/TopNav";
import { C } from "@/lib/tokens";

export default function AppLayout({ children }) {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh" }} className="pb-16 md:pb-0">
      <TopNav />
      {children}
    </div>
  );
}
