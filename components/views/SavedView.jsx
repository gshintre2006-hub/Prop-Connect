"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { C } from "@/lib/tokens";
import { PROPS, STORES } from "@/lib/data";
import { SectionTitle, Button } from "@/components/ui";
import { PropCard } from "@/components/PropCard";
import { StoreCard } from "@/components/StoreCard";
import { useStore } from "@/app/providers";

export function SavedView() {
  const router = useRouter();
  const { favs, favStores, toggleFav, addToCart } = useStore();

  const savedProps = PROPS.filter((p) => favs.includes(p.id));
  const savedStores = STORES.filter((s) => favStores.includes(s.id));
  const empty = savedProps.length === 0 && savedStores.length === 0;

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-10">
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Saved</h1>
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>
        {savedProps.length} prop{savedProps.length === 1 ? "" : "s"} · {savedStores.length} store{savedStores.length === 1 ? "" : "s"} — kept on this device.
      </p>

      {empty ? (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <Heart size={28} color="#B7C4C6" className="mx-auto mb-3" />
          <p style={{ color: "#8AA2A6" }} className="text-sm">Nothing saved yet. Tap the heart on any prop or store to keep it here.</p>
          <Button variant="primary" className="mt-5" onClick={() => router.push("/browse")}>Browse props</Button>
        </div>
      ) : (
        <>
          {savedProps.length > 0 && (
            <>
              <SectionTitle eyebrow="Your shortlist" title="Saved props" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-14">
                {savedProps.map((p) => (
                  <PropCard key={p.id} p={p} onFav={toggleFav} isFav onAdd={addToCart} />
                ))}
              </div>
            </>
          )}

          {savedStores.length > 0 && (
            <>
              <SectionTitle eyebrow="Follow" title="Saved stores" />
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedStores.map((s) => <StoreCard key={s.id} s={s} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
