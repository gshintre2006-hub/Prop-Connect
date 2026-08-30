"use client";

import { Ruler } from "lucide-react";
import { C } from "@/lib/tokens";
import { JOURNEY_STEPS } from "@/lib/data";
import { LOGO_FULL, LOGO_MARK } from "@/lib/logos";

/* ---------------------------------------------------------------------- */
/*  LOGO                                                                   */
/*  variant="full" -> full stacked lockup (login / hero / footer)         */
/*  variant="mark" -> icon crop + typeset wordmark for the slim navbar    */
/* ---------------------------------------------------------------------- */
export function Logo({ size = 40, variant = "mark", dark = false }) {
  if (variant === "full") {
    return (
      <img
        src={LOGO_FULL}
        alt="PropConnect — Find. Connect. Create."
        style={{ height: size, width: "auto", display: "block" }}
        className="select-none"
      />
    );
  }
  return (
    <div className="flex items-center gap-2.5 select-none">
      <img src={LOGO_MARK} alt="PropConnect" style={{ height: size, width: "auto", display: "block" }} />
      <div className="leading-none">
        <div style={{ fontFamily: "Jost, sans-serif", letterSpacing: "0.07em", fontSize: size < 40 ? "1rem" : "1.3rem" }}>
          <span style={{ color: dark ? C.white : C.primary, fontWeight: 600 }}>PROP</span>
          <span style={{ color: C.highlight, fontWeight: 600 }}>CONNECT</span>
        </div>
        <div style={{ color: dark ? C.accent : "#7C9599", fontSize: "0.6rem", letterSpacing: "0.24em", fontFamily: "Jost, sans-serif" }}>
          FIND · CONNECT · CREATE
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  PILL                                                                   */
/* ---------------------------------------------------------------------- */
export function Pill({ children, tone = "muted", className = "" }) {
  const tones = {
    muted: { background: C.primaryTint, color: C.primary },
    accent: { background: C.accent, color: C.highlight },
    good: { background: "#DCEEE4", color: "#1F7A52" },
    bad: { background: "#F5DCDA", color: C.highlight },
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-medium ${className}`}
      style={{ ...tones[tone], fontFamily: "Jost, sans-serif", letterSpacing: "0.03em" }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/*  BUTTON                                                                 */
/* ---------------------------------------------------------------------- */
export function Button({ children, onClick, variant = "primary", className = "", size = "md", disabled }) {
  const sizes = { sm: "px-3.5 py-2 text-[0.8rem]", md: "px-5 py-2.5 text-[0.88rem]", lg: "px-7 py-3.5 text-[0.95rem]" };
  const base =
    "rounded-full transition-all duration-200 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: { backgroundColor: C.primary, color: C.white },
    accent: { backgroundColor: C.highlight, color: C.white },
    outline: { backgroundColor: "transparent", color: C.primary, border: `1.3px solid ${C.primary}` },
    ghost: { backgroundColor: "transparent", color: C.primary },
    soft: { backgroundColor: C.primaryTint, color: C.primary },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${className}`}
      style={{ ...variants[variant], fontFamily: "Jost, sans-serif" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  SECTION TITLE                                                          */
/* ---------------------------------------------------------------------- */
export function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="mb-7">
      {eyebrow && (
        <div style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }} className="text-xs tracking-[0.2em] uppercase mb-2 font-medium">
          {eyebrow}
        </div>
      )}
      <h2 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl sm:text-3xl">
        {title}
      </h2>
      {sub && <p style={{ color: "#5C7A80" }} className="mt-2 text-sm max-w-xl">{sub}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  RENTAL JOURNEY TRACKER                                                 */
/* ---------------------------------------------------------------------- */
export function JourneyTracker({ statusIndex }) {
  return (
    <div className="flex items-start w-full overflow-x-auto pb-1">
      {JOURNEY_STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= statusIndex;
        const active = i === statusIndex;
        return (
          <div key={step.key} className="flex items-center min-w-[92px] flex-1 last:min-w-0 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={{
                  backgroundColor: done ? C.primary : C.white,
                  border: `1.5px solid ${done ? C.primary : C.line}`,
                  boxShadow: active ? `0 0 0 4px ${C.primaryTint}` : "none",
                }}
              >
                <Icon size={15} color={done ? C.white : "#B7C4C6"} />
              </div>
              <span
                className="text-[0.65rem] text-center leading-tight"
                style={{ color: done ? C.primary : "#A9B4B6", fontFamily: "Jost, sans-serif", fontWeight: active ? 600 : 400 }}
              >
                {step.label}
              </span>
            </div>
            {i < JOURNEY_STEPS.length - 1 && (
              <div className="h-[1.5px] flex-1 mx-1 mb-4" style={{ backgroundColor: i < statusIndex ? C.primary : C.line }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  DIMENSION OVERLAY ON IMAGE                                             */
/* ---------------------------------------------------------------------- */
export function DimensionImage({ src, alt, h, w, d }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      <img src={src} alt={alt} className="w-full h-[360px] sm:h-[420px] object-cover" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm" style={{ backgroundColor: "rgba(255,255,255,0.85)" }}>
        <Ruler size={12} color={C.primary} />
        <span className="text-[0.65rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>Actual size shown</span>
      </div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: C.primary }}>
        <span className="text-[0.68rem] text-white" style={{ fontFamily: "Jost, sans-serif" }}>H {h}</span>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: C.highlight }}>
        <span className="text-[0.68rem] text-white" style={{ fontFamily: "Jost, sans-serif" }}>W {w}</span>
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: C.secondary }}>
        <span className="text-[0.68rem] text-white" style={{ fontFamily: "Jost, sans-serif" }}>D {d}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  FOOTER                                                                 */
/* ---------------------------------------------------------------------- */
export function Footer() {
  return (
    <div style={{ backgroundColor: C.white, borderTop: `1px solid ${C.line}` }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-12 grid sm:grid-cols-4 gap-8">
        <div>
          <Logo size={34} />
          <p className="text-xs mt-4" style={{ color: "#8AA2A6" }}>The unified prop sourcing network for Indian film production.</p>
        </div>
        {[
          { h: "Platform", items: ["Browse Props", "Store Directory", "Moodboards", "Compare Props"] },
          { h: "Explore", items: ["Featured Categories", "Trending Props", "Popular Stores", "How It Works"] },
          { h: "Support", items: ["Contact Us", "Help Center", "Terms", "Privacy"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="text-sm mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{col.h}</h4>
            <ul className="space-y-2">
              {col.items.map((it) => <li key={it} className="text-xs" style={{ color: "#8AA2A6" }}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center text-[0.7rem] py-5" style={{ color: "#A9BABD", borderTop: `1px solid ${C.line}` }}>© 2026 PropConnect. Made for the Indian production design community.</div>
    </div>
  );
}
