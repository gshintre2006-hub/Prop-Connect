"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingCart, Heart, MapPin, ChevronRight,
  Phone, MessageCircle,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { PROPS, storeById } from "@/lib/data";
import { DimensionImage, SectionTitle, Button, Pill } from "@/components/ui";
import { PropCard } from "@/components/PropCard";
import { useStore } from "@/app/providers";

export function PropDetailView({ prop }) {
  const router = useRouter();
  const { favs, toggleFav, addToCart } = useStore();
  const store = storeById(prop.storeId);
  const related = PROPS.filter((p) => p.category === prop.category && p.id !== prop.id).slice(0, 4);

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-8">
      <button onClick={() => router.push("/browse")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-10">
        <div>
          <DimensionImage src={prop.img} alt={prop.name} h={prop.h} w={prop.w} d={prop.d} />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[prop.img, store.photos[0], store.photos[1]].map((im, i) => (
              <img key={i} src={im} className="w-full h-[80px] object-cover rounded-xl" style={{ border: `1px solid ${C.line}` }} alt="" />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-base mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Specifications</h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 rounded-2xl p-5" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              {[
                ["Material", prop.material], ["Style", prop.style], ["Era", prop.era], ["Finish", prop.finish],
                ["Colour", prop.color], ["Weight", prop.weight],
                ["Dimensions (H×W×D)", `${prop.h} × ${prop.w} × ${prop.d}`], ["Quantity in stock", prop.qty],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5" style={{ borderBottom: `1px dashed ${C.line}` }}>
                  <span style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>{k}</span>
                  <span style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Pill tone={prop.available ? "good" : "bad"}>{prop.available ? "Available now" : "Currently booked"}</Pill>
          <h1 className="text-2xl mt-3 mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{prop.name}</h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>{prop.category} · {prop.material}</p>

          <div className="flex items-end gap-2 mt-5">
            <span className="text-3xl" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>₹{prop.price}</span>
            <span className="text-sm mb-1" style={{ color: "#9AAEB1" }}>/ day rental</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#9AAEB1" }}>Refundable deposit ₹{prop.deposit.toLocaleString("en-IN")}</p>

          <div className="flex gap-3 mt-6">
            <Button variant="primary" size="lg" className="flex-1" disabled={!prop.available} onClick={() => addToCart(prop)}>
              <ShoppingCart size={16} /> Add to cart
            </Button>
            <button onClick={() => toggleFav(prop.id)} className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ border: `1.3px solid ${C.line}` }}>
              <Heart size={18} color={C.highlight} fill={favs.includes(prop.id) ? C.highlight : "none"} />
            </button>
          </div>

          <button onClick={() => router.push(`/stores/${store.id}`)} className="w-full mt-8 rounded-2xl p-4 flex items-center gap-3 text-left" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <img src={store.logo} className="w-12 h-12 rounded-full object-cover" alt="" />
            <div className="flex-1">
              <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{store.name}</div>
              <div className="text-[0.72rem] flex items-center gap-1" style={{ color: "#8AA2A6" }}><MapPin size={10} /> {store.location}</div>
            </div>
            <ChevronRight size={16} color="#8AA2A6" />
          </button>

          <div className="flex gap-2 mt-3">
            <a href={`tel:${store.phone}`} className="flex-1 rounded-full py-2.5 flex items-center justify-center gap-1.5 text-xs" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif" }}>
              <Phone size={13} /> Call store
            </a>
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 rounded-full py-2.5 flex items-center justify-center gap-1.5 text-xs" style={{ backgroundColor: "#DCEEE4", color: "#1F7A52", fontFamily: "Jost, sans-serif" }}>
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionTitle eyebrow="You may also like" title="Related props" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
