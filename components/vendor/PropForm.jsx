"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES } from "@/lib/data";
import { img as buildImg } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

const STEPS = [
  { id: "basic", label: "Basic information" },
  { id: "specs", label: "Specifications" },
  { id: "dims", label: "Dimensions" },
  { id: "rental", label: "Rental information" },
  { id: "stock", label: "Inventory & availability" },
  { id: "photo", label: "Photo" },
];

const STATUS_OPTIONS = [
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "rented", label: "Out on rent" },
  { key: "maintenance", label: "Maintenance" },
  { key: "hidden", label: "Hidden" },
];

function parseFtIn(s) {
  const m = /(-?\d+)'\s*(\d+)?/.exec(s || "");
  return m ? { ft: m[1], inch: m[2] || "0" } : { ft: "", inch: "" };
}
const toFtIn = (ft, inch) => (ft || inch ? `${ft || 0}'${inch || 0}"` : "");

const FIELD = "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none";
const fs = { border: `1px solid ${C.line}`, backgroundColor: C.bg, color: C.ink, fontFamily: "Jost, sans-serif" };
function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

export function PropForm({ propId, initial }) {
  const router = useRouter();
  const { addProp, editProp } = useVendorData();
  const isEdit = Boolean(propId);

  const hFI = parseFtIn(initial?.h);
  const wFI = parseFtIn(initial?.w);
  const dFI = parseFtIn(initial?.d);
  const seatFI = parseFtIn(initial?.seat);

  const [f, setF] = useState({
    name: initial?.name || "", category: initial?.category || CATEGORIES[0], subCategory: initial?.sub_category || "",
    keywords: initial?.keywords || "", tags: initial?.tags || "", description: initial?.description || "",
    material: initial?.material || "", finish: initial?.finish || "", style: initial?.style || "",
    era: initial?.era || "", color: initial?.color || "", condition: initial?.condition || "Excellent",
    hFt: hFI.ft, hIn: hFI.inch, wFt: wFI.ft, wIn: wFI.inch, dFt: dFI.ft, dIn: dFI.inch,
    seatFt: seatFI.ft, seatIn: seatFI.inch, hasSeat: Boolean(initial?.seat), weight: initial?.weight || "",
    price: initial?.price ?? "", deposit: initial?.deposit ?? "", replacementValue: initial?.replacement_value ?? "",
    minDays: initial?.min_days ?? 1, maxDays: initial?.max_days ?? 30,
    qty: initial?.qty ?? 1, status: initial?.status || "available",
  });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const previewImg = useMemo(
    () => buildImg(`${f.name || "prop"}, ${f.era} ${f.style} ${f.material}, ${f.color}`),
    [f.name, f.era, f.style, f.material, f.color]
  );

  const submit = async () => {
    if (!f.name.trim()) { setError("Prop name is required."); setStep(0); return; }
    setBusy(true);
    setError("");
    const payload = {
      name: f.name.trim(), category: f.category, subCategory: f.subCategory, keywords: f.keywords,
      tags: f.tags, description: f.description, material: f.material, finish: f.finish, style: f.style,
      era: f.era, color: f.color, condition: f.condition,
      h: toFtIn(f.hFt, f.hIn), w: toFtIn(f.wFt, f.wIn), d: toFtIn(f.dFt, f.dIn),
      seat: f.hasSeat ? toFtIn(f.seatFt, f.seatIn) : "",
      weight: f.weight, price: f.price, deposit: f.deposit, replacementValue: f.replacementValue,
      minDays: f.minDays, maxDays: f.maxDays, qty: f.qty, status: f.status,
    };
    try {
      if (isEdit) await editProp(propId, payload);
      else await addProp(payload);
      router.push("/vendor/inventory");
    } catch (err) {
      setError(err?.message || "Couldn't save this prop. Try again.");
      setBusy(false);
    }
  };

  return (
    <div>
      <button onClick={() => router.push("/vendor/inventory")} className="flex items-center gap-1.5 text-sm mb-5" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>
        <ArrowLeft size={15} /> Back to inventory
      </button>

      <div className="mb-6">
        <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{isEdit ? "Edit prop" : "Add new prop"}</h1>
        <p className="text-sm" style={{ color: "#7C9599" }}>Fill in each section, then publish — it appears on PropConnect immediately.</p>
      </div>

      <div className="grid lg:grid-cols-[200px,1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.78rem] whitespace-nowrap shrink-0"
              style={{
                backgroundColor: i === step ? C.primary : "transparent",
                color: i === step ? C.white : "#6B8489",
                fontFamily: "Jost, sans-serif", fontWeight: i === step ? 500 : 400,
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] shrink-0"
                style={{ border: `1px solid ${i === step ? C.white : C.line}`, backgroundColor: i === step ? "rgba(255,255,255,0.2)" : "transparent" }}
              >
                {i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        <div>
          {error && <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>}

          <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>1. Basic information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Prop name *"><input className={FIELD} style={fs} value={f.name} onChange={set("name")} placeholder="e.g. Mid-century lounge chair" /></Field>
                  <Field label="Category">
                    <select className={FIELD} style={fs} value={f.category} onChange={set("category")}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Sub category"><input className={FIELD} style={fs} value={f.subCategory} onChange={set("subCategory")} placeholder="Chair, Table, Lighting…" /></Field>
                  <Field label="Keywords"><input className={FIELD} style={fs} value={f.keywords} onChange={set("keywords")} placeholder="walnut, low-back, 1960s" /></Field>
                </div>
                <Field label="Description"><textarea rows={3} className={FIELD} style={{ ...fs, resize: "vertical" }} value={f.description} onChange={set("description")} placeholder="Short, accurate description art directors can scan quickly." /></Field>
                <Field label="Tags"><input className={FIELD} style={fs} value={f.tags} onChange={set("tags")} placeholder="period-drama, boardroom, retro" /></Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>2. Specifications</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Material"><input className={FIELD} style={fs} value={f.material} onChange={set("material")} placeholder="Walnut, brass" /></Field>
                  <Field label="Finish"><input className={FIELD} style={fs} value={f.finish} onChange={set("finish")} placeholder="Matte lacquer" /></Field>
                  <Field label="Style"><input className={FIELD} style={fs} value={f.style} onChange={set("style")} placeholder="Mid-century modern" /></Field>
                  <Field label="Era"><input className={FIELD} style={fs} value={f.era} onChange={set("era")} placeholder="1960s" /></Field>
                  <Field label="Colour"><input className={FIELD} style={fs} value={f.color} onChange={set("color")} placeholder="Walnut brown" /></Field>
                  <Field label="Condition">
                    <select className={FIELD} style={fs} value={f.condition} onChange={set("condition")}>
                      {["Excellent", "Good", "Fair", "Needs repair"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="max-w-[220px]"><Field label="Weight (kg)"><input className={FIELD} style={fs} value={f.weight} onChange={set("weight")} placeholder="12 kg" /></Field></div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>3. Dimensions</h3>
                <p className="text-xs" style={{ color: "#9AAEB1" }}>Stored in feet &amp; inches — this is exactly how they show up on the prop's 360° view.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[["Height", "hFt", "hIn"], ["Width", "wFt", "wIn"], ["Depth", "dFt", "dIn"]].map(([label, ftKey, inKey]) => (
                    <div key={label}>
                      <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>{label}</label>
                      <div className="flex gap-2">
                        <input className={FIELD} style={fs} value={f[ftKey]} onChange={set(ftKey)} placeholder="3" />
                        <input className={FIELD} style={fs} value={f[inKey]} onChange={set(inKey)} placeholder="6" />
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs" style={{ color: "#6B8489" }}>
                  <input type="checkbox" checked={f.hasSeat} onChange={(e) => setF((s) => ({ ...s, hasSeat: e.target.checked }))} /> This is a seating item (adds a seat-height line)
                </label>
                {f.hasSeat && (
                  <div className="max-w-[220px]">
                    <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Seat height</label>
                    <div className="flex gap-2">
                      <input className={FIELD} style={fs} value={f.seatFt} onChange={set("seatFt")} placeholder="1" />
                      <input className={FIELD} style={fs} value={f.seatIn} onChange={set("seatIn")} placeholder="5" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>4. Rental information</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Rental price / day (₹)"><input className={FIELD} style={fs} value={f.price} onChange={set("price")} placeholder="450" /></Field>
                  <Field label="Security deposit (₹)"><input className={FIELD} style={fs} value={f.deposit} onChange={set("deposit")} placeholder="2000" /></Field>
                  <Field label="Replacement value (₹)"><input className={FIELD} style={fs} value={f.replacementValue} onChange={set("replacementValue")} placeholder="18000" /></Field>
                  <Field label="Minimum rental days"><input className={FIELD} style={fs} value={f.minDays} onChange={set("minDays")} /></Field>
                  <Field label="Maximum rental days"><input className={FIELD} style={fs} value={f.maxDays} onChange={set("maxDays")} /></Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>5. Inventory &amp; availability</h3>
                <div className="max-w-[160px]"><Field label="Quantity"><input className={FIELD} style={fs} value={f.qty} onChange={set("qty")} /></Field></div>
                <div>
                  <label className="text-xs mb-2 block" style={{ color: "#6B8489" }}>Status shown to art directors</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((o) => (
                      <button
                        key={o.key}
                        onClick={() => setF((s) => ({ ...s, status: o.key }))}
                        className="text-xs px-3.5 py-2 rounded-full"
                        style={{
                          fontFamily: "Jost, sans-serif",
                          backgroundColor: f.status === o.key ? C.primary : C.bg,
                          color: f.status === o.key ? C.white : C.primary,
                          border: `1px solid ${f.status === o.key ? C.primary : C.line}`,
                        }}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-[0.95rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>6. Photo</h3>
                <p className="text-xs" style={{ color: "#9AAEB1" }}>
                  PropConnect generates a representative product photo automatically from the name, material, era and style you entered above — the same way every other listing on the network gets its image.
                </p>
                <img src={previewImg} alt="Preview" className="w-full max-w-[320px] h-[220px] object-cover rounded-xl" style={{ border: `1px solid ${C.line}` }} />
              </div>
            )}

            <div className="flex justify-between mt-7 pt-5" style={{ borderTop: `1px dashed ${C.line}` }}>
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full px-4 py-2.5 text-xs disabled:opacity-30"
                style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)} className="rounded-full px-5 py-2.5 text-xs" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
                  Continue
                </button>
              ) : (
                <button onClick={submit} disabled={busy} className="rounded-full px-5 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
                  <Check size={14} /> {busy ? "Publishing…" : "Publish to PropConnect"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
