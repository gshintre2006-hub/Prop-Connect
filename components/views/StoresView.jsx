"use client";

import { useMemo, useState } from "react";
import { MapPin, Navigation, X, ExternalLink } from "lucide-react";
import { C } from "@/lib/tokens";
import { STORES } from "@/lib/data";
import { haversineKm, fmtKm } from "@/lib/geo";
import { mapsAreaUrl } from "@/lib/maps";
import { StoreCard } from "@/components/StoreCard";

const RADII = [2, 5, 10, 25];

export function StoresView() {
  const [loc, setLoc] = useState(null);
  const [radius, setRadius] = useState(5);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const enableNear = () => {
    setErr("");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setErr("Location isn't available on this device.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBusy(false);
      },
      (e) => {
        setBusy(false);
        setErr(
          e.code === 1
            ? "Location permission was denied. Allow it in your browser to see nearby stores."
            : "Couldn't get your location. Try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const ranked = useMemo(() => {
    if (!loc) return STORES.map((s) => ({ s, km: null }));
    return STORES.map((s) => ({ s, km: haversineKm(loc, s) })).sort((a, b) => a.km - b.km);
  }, [loc]);

  const near = loc ? ranked.filter((x) => x.km <= radius) : null;
  const list = near ?? ranked;
  const nearest = ranked[0];

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Store directory</h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>{STORES.length} verified rental stores on the network.</p>
        </div>
        <a
          href={mapsAreaUrl()}
          target="_blank"
          rel="noreferrer"
          className="text-xs flex items-center gap-1.5 rounded-full px-3.5 py-2"
          style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
        >
          <ExternalLink size={13} /> View area on Google Maps
        </a>
      </div>

      {/* Near me */}
      <div className="rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-3" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {!loc ? (
          <button
            onClick={enableNear}
            disabled={busy}
            className="rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
            style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
          >
            <Navigation size={13} /> {busy ? "Locating…" : "Show stores near me"}
          </button>
        ) : (
          <>
            <span className="text-xs flex items-center gap-1.5" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>
              <MapPin size={13} /> Within
            </span>
            <div className="flex gap-1.5">
              {RADII.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    fontFamily: "Jost, sans-serif",
                    backgroundColor: radius === r ? C.primary : C.bg,
                    color: radius === r ? C.white : C.primary,
                    border: `1px solid ${radius === r ? C.primary : C.line}`,
                  }}
                >
                  {r} km
                </button>
              ))}
            </div>
            <span className="text-xs" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>
              {near.length} store{near.length === 1 ? "" : "s"} within {radius} km
            </span>
            <button onClick={() => { setLoc(null); setErr(""); }} className="text-xs flex items-center gap-1 ml-auto" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
              <X size={12} /> Clear
            </button>
          </>
        )}
        {err && <span className="text-xs w-full" style={{ color: C.highlight }}>{err}</span>}
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <MapPin size={26} color="#B7C4C6" className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8AA2A6" }}>
            No stores within {radius} km.{" "}
            {nearest && `The nearest is ${nearest.s.name}, about ${fmtKm(nearest.km)} away.`}
          </p>
          <button onClick={() => setRadius(25)} className="mt-4 text-xs rounded-full px-4 py-2" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
            Widen to 25 km
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {list.map(({ s, km }) => (
            <StoreCard key={s.id} s={s} layout="row" distanceKm={km} from={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
