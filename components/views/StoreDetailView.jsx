"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, MapPin, Phone, MessageCircle, Mail, Clock, Heart,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { PROPS } from "@/lib/data";
import { Button, SectionTitle, Footer } from "@/components/ui";
import { PropCard } from "@/components/PropCard";
import { useStore } from "@/app/providers";

export function StoreDetailView({ store }) {
  const router = useRouter();
  const { favs, toggleFav, addToCart, favStores, toggleFavStore } = useStore();
  const items = PROPS.filter((p) => p.storeId === store.id);
  const isFav = favStores.includes(store.id);

  return (
    <div>
      <div className="relative h-[220px] sm:h-[280px]">
        <img src={store.photos[0]} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,60,75,0.55), rgba(0,60,75,0))" }} />
        <button onClick={() => router.push("/stores")} className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
          <ArrowLeft size={15} color={C.primary} />
        </button>
        <button
          onClick={() => toggleFavStore(store.id)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          aria-label={isFav ? "Remove from saved" : "Save store"}
        >
          <Heart size={15} color={C.highlight} fill={isFav ? C.highlight : "none"} />
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 -mt-12 relative">
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <img src={store.logo} className="w-16 h-16 rounded-2xl object-cover" alt="" />
          <div className="flex-1">
            <h1 className="text-xl" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{store.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[0.75rem]" style={{ color: "#7C9599" }}>
              <span className="flex items-center gap-1"><Star size={11} fill={C.highlight} color={C.highlight} /> {store.rating}</span>
              <span>·</span><span>{store.totalProps} props listed</span>
              <span>·</span><span>{store.hours}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <a href={`tel:${store.phone}`} className="flex-1 sm:flex-none justify-center rounded-full px-4 py-2.5 flex items-center gap-1.5 text-xs" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif" }}><Phone size={13} /> Call</a>
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none justify-center rounded-full px-4 py-2.5 flex items-center gap-1.5 text-xs" style={{ backgroundColor: "#DCEEE4", color: "#1F7A52", fontFamily: "Jost, sans-serif" }}><MessageCircle size={13} /> WhatsApp</a>
            <a href={`mailto:${store.email}`} className="flex-1 sm:flex-none justify-center rounded-full px-4 py-2.5 flex items-center gap-1.5 text-xs" style={{ backgroundColor: C.accent, color: C.highlight, fontFamily: "Jost, sans-serif" }}><Mail size={13} /> Email</a>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,0.7fr] gap-8 mt-8">
          <div>
            <h3 className="text-base mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Gallery</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {store.photos.map((p, i) => <img key={i} src={p} className="w-full h-[130px] object-cover rounded-xl" alt="" />)}
            </div>

            <h3 className="text-base mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Inventory from this store</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((p) => <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />)}
            </div>
          </div>

          <div>
            <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <h4 className="text-sm mb-3 flex items-center gap-1.5" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}><MapPin size={14} /> Location</h4>
              <p className="text-xs mb-3" style={{ color: "#6B8489" }}>{store.address}</p>
              <div className="rounded-xl h-[150px] flex items-center justify-center" style={{ backgroundColor: C.primaryTint }}>
                <div className="text-center">
                  <MapPin size={20} color={C.primary} className="mx-auto mb-1" />
                  <span className="text-[0.7rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>Map preview</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, "_blank")}>
                Get directions
              </Button>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <h4 className="text-sm mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Contact</h4>
              <div className="space-y-2.5 text-xs" style={{ color: "#6B8489" }}>
                <div className="flex items-center gap-2"><Phone size={12} color={C.secondary} /> {store.phone}</div>
                <div className="flex items-center gap-2"><Mail size={12} color={C.secondary} /> {store.email}</div>
                <div className="flex items-center gap-2"><Clock size={12} color={C.secondary} /> {store.hours}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14"><Footer /></div>
    </div>
  );
}
