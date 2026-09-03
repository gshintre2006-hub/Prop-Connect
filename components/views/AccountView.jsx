"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check, Camera, Trash2 } from "lucide-react";
import { C } from "@/lib/tokens";
import { Button } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

function Field({ label, value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>{label}</label>
      <input
        value={value || ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-60"
        style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
      />
    </div>
  );
}

// Resize any picked image to a 256px square JPEG data URL (small enough to
// live in user_metadata — no storage bucket needed).
function fileToAvatarDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error("That file isn't a valid image."));
      im.onload = () => {
        const S = 256;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(S / im.width, S / im.height);
        const w = im.width * scale;
        const h = im.height * scale;
        ctx.drawImage(im, (S - w) / 2, (S - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      im.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function AccountView() {
  const router = useRouter();
  const { user, loading, updateProfile, signOut } = useAuth();
  const fileRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const m = user.user_metadata ?? {};
    setFullName(m.full_name ?? m.name ?? "");
    setPhone(m.phone ?? "");
    setCompany(m.company ?? "");
    setAvatar(m.avatar_url ?? m.picture ?? "");
  }, [user]);

  if (loading || !user) {
    return (
      <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-16 text-sm" style={{ color: "#8AA2A6" }}>
        Loading your profile…
      </div>
    );
  }

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setPhotoBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      const { error: err } = await updateProfile({ avatar_url: dataUrl });
      if (err) throw new Error(err.message);
      setAvatar(dataUrl);
    } catch (err) {
      setError(err.message || "Couldn't update the photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    setError("");
    setPhotoBusy(true);
    const { error: err } = await updateProfile({ avatar_url: "" });
    setPhotoBusy(false);
    if (err) setError(err.message);
    else setAvatar("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setBusy(true);
    const { error: err } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      company: company.trim(),
    });
    setBusy(false);
    if (err) return setError(err.message);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const doSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-10">
      <h1 className="text-2xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Your profile</h1>
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>Update how you appear to partner stores.</p>

      <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />

        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group"
            style={{ backgroundColor: C.primary }}
            title="Change photo"
          >
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-2xl font-semibold" style={{ color: C.white, fontFamily: "Jost, sans-serif" }}>
                {(fullName || user.email || "?").slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
              <Camera size={18} color="#fff" />
            </span>
          </button>

          <div className="min-w-0">
            <div className="text-base truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{fullName || "—"}</div>
            <div className="text-sm truncate" style={{ color: "#8AA2A6" }}>{user.email}</div>
            <div className="flex items-center gap-3 mt-1.5">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} className="text-[0.72rem] disabled:opacity-50" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
                {photoBusy ? "Updating…" : avatar ? "Change photo" : "Add photo"}
              </button>
              {avatar && !photoBusy && (
                <button type="button" onClick={removePhoto} className="text-[0.72rem] flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
                  <Trash2 size={11} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>
        )}

        <form onSubmit={save} className="space-y-4">
          <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
          <Field label="Email (from your sign-in — can't be changed here)" value={user.email} disabled />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98XXX XXXXX" />
          <Field label="Company / Studio" value={company} onChange={setCompany} placeholder="e.g. Kohraam Productions" />

          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" size="lg" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "#1F7A52", fontFamily: "Jost, sans-serif" }}>
                <Check size={14} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>

      <button onClick={doSignOut} className="mt-6 flex items-center gap-2 text-sm" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
        <LogOut size={15} /> Sign out
      </button>
    </div>
  );
}
