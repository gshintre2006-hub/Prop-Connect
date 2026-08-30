"use client";

import { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { C } from "@/lib/tokens";
import { useStore } from "@/app/providers";

export function MoodboardView() {
  const { moodboardImages: images, addMoodboardImages, removeMoodboardImage } = useStore();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    const newImages = files.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    addMoodboardImages(newImages);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-8 sm:py-10">
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Moodboard</h1>
      <p className="text-sm mb-7" style={{ color: "#7C9599" }}>
        Drag and drop reference photos, set inspiration, or your own site pictures here — space stays open for images you add anytime.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
        style={{
          minHeight: "220px",
          padding: "32px 16px",
          border: `2px dashed ${dragging ? C.highlight : C.line}`,
          backgroundColor: dragging ? C.accent : C.white,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: C.primaryTint }}>
          <UploadCloud size={24} color={C.primary} />
        </div>
        <p className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
          Drag photos here, or click to browse
        </p>
        <p className="text-xs mt-1.5" style={{ color: "#9AAEB1" }}>
          JPG, PNG — add as many as you like, anytime
        </p>
      </div>

      {images.length === 0 ? (
        <div className="mt-8 rounded-2xl p-8 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <ImageIcon size={26} color="#B7C4C6" className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8AA2A6" }}>No photos yet. This board stays ready for whatever you drop in.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
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
