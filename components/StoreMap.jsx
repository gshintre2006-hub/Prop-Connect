"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { C } from "@/lib/tokens";
import { mapEmbedSrc, mapsPlaceUrl, mapsDirectionsUrl } from "@/lib/maps";

/**
 * Store location block. Shows an embedded Google map when
 * NEXT_PUBLIC_GOOGLE_MAPS_KEY is set, otherwise a styled placeholder.
 * Direction / open-in-maps links work either way.
 */
export function StoreMap({ store, from, height = 190 }) {
  const embed = mapEmbedSrc(store);

  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}`, height }}>
        {embed ? (
          <iframe
            title={`Map — ${store.name}`}
            src={embed}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <a
            href={mapsPlaceUrl(store)}
            target="_blank"
            rel="noreferrer"
            className="w-full h-full flex flex-col items-center justify-center gap-1.5"
            style={{ backgroundColor: C.primaryTint }}
          >
            <MapPin size={22} color={C.primary} />
            <span className="text-[0.72rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>Open location in Google Maps</span>
            {store.lat != null && (
              <span className="text-[0.62rem]" style={{ color: "#7C9599", fontFamily: "Jost, sans-serif" }}>
                {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
              </span>
            )}
          </a>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <a
          href={mapsDirectionsUrl(store, from)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-full py-2.5 flex items-center justify-center gap-1.5 text-xs"
          style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
        >
          <Navigation size={13} /> Directions
        </a>
        <a
          href={mapsPlaceUrl(store)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-4 py-2.5 flex items-center justify-center gap-1.5 text-xs"
          style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
        >
          <ExternalLink size={13} /> Maps
        </a>
      </div>
    </div>
  );
}
