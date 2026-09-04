"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud, Image as ImageIcon, Plus, Trash2, Sparkles, FileDown, Check,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { PROPS, storeById } from "@/lib/data";
import { MOOD_TONES, suggestProps, stylistIntro } from "@/lib/stylist";
import { exportMoodboardPdf } from "@/lib/moodboardPdf";
import { useStore } from "@/app/providers";

const PROP_BY_ID = Object.fromEntries(PROPS.map((p) => [p.id, p]));

// Downscale a same-origin image (user upload) to a small JPEG data URL for the
// vision request. Cross-origin images (stock prop photos) taint the canvas and
// resolve null — they're skipped.
function toSmallDataUrl(src, max = 768) {
  return new Promise((resolve) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.8));
      } catch {
        resolve(null);
      }
    };
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

export function MoodboardView() {
  const router = useRouter();
  const { moodboardImages: images, addMoodboardImages, removeMoodboardImage } = useStore();
  const fileInputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [tone, setTone] = useState("warm");
  const [desc, setDesc] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chat, setChat] = useState(null); // { intro, results: [{prop, reason}] }
  const [added, setAdded] = useState([]); // prop ids added to board
  const [pdfBusy, setPdfBusy] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    addMoodboardImages(
      files.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(f),
        name: f.name,
      }))
    );
  };

  const uploads = images.filter((i) => !i.id.startsWith("prop-")); // user photos, not added props
  const usePhotos = uploads.slice(0, 4);

  const askStylist = async () => {
    setThinking(true);
    setChat(null);

    let results = null;
    let via = "match";
    let sentPhotos = 0;
    let providerLabel = "";
    try {
      const imgs = (await Promise.all(usePhotos.map((i) => toSmallDataUrl(i.url)))).filter(Boolean);
      sentPhotos = imgs.length;
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, description: desc, images: imgs }),
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.picks || [])
          .map((p) => ({ prop: PROP_BY_ID[p.id], reason: p.reason }))
          .filter((x) => x.prop);
        if (mapped.length) {
          results = mapped;
          via = imgs.length ? "ai-photos" : "ai";
          providerLabel = data.provider === "gemini" ? "Gemini" : "Claude";
        }
      }
    } catch {
      /* fall through to the local matcher */
    }

    if (!results || !results.length) {
      results = suggestProps({
        tone,
        description: desc,
        imageHints: uploads.map((i) => i.name || ""),
        limit: 6,
      });
      via = uploads.length ? "match-photos" : "match";
    }

    setChat({
      intro: stylistIntro({ tone, description: desc, count: results.length, photos: sentPhotos || (via === "match-photos" ? uploads.length : 0) }),
      results,
      via,
      providerLabel,
      thumbs: usePhotos.map((i) => i.url),
    });
    setThinking(false);
  };

  const addProp = (prop) => {
    addMoodboardImages([{ id: `prop-${prop.id}-${Date.now()}`, url: prop.img, name: prop.name }]);
    setAdded((a) => [...a, prop.id]);
  };

  const doExport = async () => {
    setPdfBusy(true);
    try {
      await exportMoodboardPdf({
        toneLabel: (MOOD_TONES.find((t) => t.key === tone) || {}).label,
        description: desc,
        images,
        suggestions: chat?.results || [],
      });
    } finally {
      setPdfBusy(false);
    }
  };

  const canExport = images.length > 0 || (chat?.results || []).length > 0;

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-8 sm:py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Moodboard</h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>
            Add photos of your space, set a mood tone, and let the stylist suggest props that fit — then share the board as a PDF.
          </p>
        </div>
        <button
          onClick={doExport}
          disabled={!canExport || pdfBusy}
          className="shrink-0 rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-40"
          style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
        >
          <FileDown size={14} /> {pdfBusy ? "Building…" : "Share as PDF"}
        </button>
      </div>

      {/* The space + stylist */}
      <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <div className="text-xs mb-2" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Mood tone</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {MOOD_TONES.map((t) => (
            <button
              key={t.key}
              onClick={() => setTone(t.key)}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "Jost, sans-serif",
                backgroundColor: tone === t.key ? C.primary : C.bg,
                color: tone === t.key ? C.white : C.primary,
                border: `1px solid ${tone === t.key ? C.primary : C.line}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="text-xs mb-2" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Describe the space</div>
        <textarea
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. 1970s middle-class Bombay living room, warm evening light, teak and brass, a reading corner…"
          className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
          style={{ border: `1px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
        />

        <button
          onClick={askStylist}
          disabled={thinking}
          className="mt-3 rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
          style={{ backgroundColor: C.highlight, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
        >
          <Sparkles size={14} /> {thinking ? "Thinking…" : usePhotos.length ? `Suggest from ${usePhotos.length} photo${usePhotos.length === 1 ? "" : "s"} + brief` : "Suggest props for this space"}
        </button>

        {(thinking || chat) && (
          <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: C.bg, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.primary }}>
                <Sparkles size={13} color={C.white} />
              </div>
              <span className="text-xs" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>
                PropConnect Stylist{chat?.providerLabel ? ` · ${chat.providerLabel}` : ""}
              </span>
              {chat && (
                <span className="text-[0.62rem] px-2 py-0.5 rounded-full" style={{ backgroundColor: C.bg, color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>
                  {chat.via === "ai-photos" ? "read your photos + brief" : chat.via === "ai" ? "read your brief" : chat.via === "match-photos" ? "photo names + brief" : "attribute match"}
                </span>
              )}
            </div>

            {thinking ? (
              <p className="text-sm" style={{ color: "#8AA2A6" }}>Looking through partner inventory…</p>
            ) : (
              <>
                {chat.thumbs?.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[0.68rem]" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>Considering:</span>
                    {chat.thumbs.map((u, i) => (
                      <img key={i} src={u} alt="" className="w-9 h-9 rounded-lg object-cover" style={{ border: `1px solid ${C.line}` }} />
                    ))}
                  </div>
                )}
                <p className="text-sm mb-4" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{chat.intro}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {chat.results.map(({ prop, reason }) => (
                    <div key={prop.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                      <img src={prop.img} alt={prop.name} className="w-full h-24 object-cover" />
                      <div className="p-3">
                        <div className="text-[0.8rem] leading-tight" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>{prop.name}</div>
                        <div className="text-[0.68rem] mt-0.5" style={{ color: "#8AA2A6" }}>{storeById(prop.storeId)?.name} · ₹{prop.price}/day</div>
                        {reason && (
                          <div className="text-[0.66rem] mt-1" style={{ color: C.secondary }}>matches “{reason}”</div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => addProp(prop)}
                            disabled={added.includes(prop.id)}
                            className="flex-1 rounded-full py-1.5 text-[0.68rem] flex items-center justify-center gap-1 disabled:opacity-60"
                            style={{ backgroundColor: added.includes(prop.id) ? "#DCEEE4" : C.primaryTint, color: added.includes(prop.id) ? "#1F7A52" : C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
                          >
                            {added.includes(prop.id) ? <><Check size={11} /> Added</> : <><Plus size={11} /> Add to board</>}
                          </button>
                          <button
                            onClick={() => router.push(`/props/${prop.id}`)}
                            className="rounded-full px-2.5 py-1.5 text-[0.68rem]"
                            style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Space photos */}
      <div className="text-xs mb-3" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Space photos &amp; references</div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-2xl flex items-center gap-3 cursor-pointer transition-colors px-4 py-3.5"
        style={{
          border: `1.5px dashed ${dragging ? C.highlight : C.line}`,
          backgroundColor: dragging ? C.accent : C.white,
        }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryTint }}>
          <UploadCloud size={16} color={C.primary} />
        </div>
        <div className="min-w-0">
          <p className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Drag photos here, or click to browse</p>
          <p className="text-[0.72rem]" style={{ color: "#9AAEB1" }}>Space shots, set references, inspiration — add anytime</p>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="mt-6 rounded-2xl p-8 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <ImageIcon size={26} color="#B7C4C6" className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8AA2A6" }}>No photos yet. This board stays ready for whatever you drop in.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, aspectRatio: "1 / 1" }}>
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeMoodboardImage(img.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
              >
                <Trash2 size={13} color="#fff" />
              </button>
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors"
            style={{ border: `1.5px dashed ${C.line}`, aspectRatio: "1 / 1", backgroundColor: C.bg, color: C.primary }}
          >
            <Plus size={18} />
            <span className="text-[0.7rem]" style={{ fontFamily: "Jost, sans-serif" }}>Add more</span>
          </button>
        </div>
      )}
    </div>
  );
}
