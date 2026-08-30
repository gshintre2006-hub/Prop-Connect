import Link from "next/link";
import { C } from "@/lib/tokens";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: C.bg }}>
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-3xl mb-2">
        Page not found
      </h1>
      <p className="text-sm mb-6" style={{ color: "#6B8489" }}>
        That prop or store isn&apos;t in the directory.
      </p>
      <Link
        href="/"
        className="rounded-full px-6 py-3 text-sm"
        style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif" }}
      >
        Back to home
      </Link>
    </div>
  );
}
