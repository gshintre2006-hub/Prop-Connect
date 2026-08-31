"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check } from "lucide-react";
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

export function AccountView() {
  const router = useRouter();
  const { user, loading, updateProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const m = user.user_metadata ?? {};
    setFullName(m.full_name ?? m.name ?? "");
    setPhone(m.phone ?? "");
    setCompany(m.company ?? "");
  }, [user]);

  if (loading || !user) {
    return (
      <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-16 text-sm" style={{ color: "#8AA2A6" }}>
        Loading your profile…
      </div>
    );
  }

  const m = user.user_metadata ?? {};
  const avatar = m.avatar_url || m.picture;

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
    if (err) {
      setError(err.message);
      return;
    }
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
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>Signed in with Google. Update how you appear to partner stores.</p>

      <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-4 mb-6">
          {avatar ? (
            <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif" }}>
              {(user.email || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-base truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{fullName || "—"}</div>
            <div className="text-sm truncate" style={{ color: "#8AA2A6" }}>{user.email}</div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>
        )}

        <form onSubmit={save} className="space-y-4">
          <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
          <Field label="Email (from Google — can't be changed here)" value={user.email} disabled />
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
