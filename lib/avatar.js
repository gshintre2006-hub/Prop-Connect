/* Profile photo lives in localStorage, NOT in Supabase user_metadata.
   Anything in user_metadata is embedded in the session JWT / auth cookie —
   a base64 image there quickly blows past Vercel's request-header limit and
   makes the whole site 494 for that user. Keep it per-device instead. */

const KEY = "pc.avatar";
const EVT = "pc:avatar";

export function readAvatar() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function writeAvatar(dataUrl) {
  try {
    if (dataUrl) localStorage.setItem(KEY, dataUrl);
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode / storage full — ignore */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}

/** Subscribe to avatar changes; returns an unsubscribe fn. */
export function onAvatarChange(fn) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVT, fn);
    window.removeEventListener("storage", fn);
  };
}
