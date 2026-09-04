/* Google Maps URL + embed helpers.
   Everything here works with no API key (link-outs). An embedded interactive
   map appears only when NEXT_PUBLIC_GOOGLE_MAPS_KEY is set. */

// accept the common misspelling (…_MAP_KEY without the S) too
export const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ||
  "";

const coords = (s) => (s?.lat != null && s?.lng != null ? `${s.lat},${s.lng}` : null);
const q = (s) => coords(s) || s?.address || s?.name || "";

/** Opens the place in Google Maps. */
export function mapsPlaceUrl(s) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q(s))}`;
}

/** Turn-by-turn directions to the store from the user's location. */
export function mapsDirectionsUrl(s, from) {
  const dest = encodeURIComponent(q(s));
  const origin = from && from.lat != null ? `&origin=${from.lat},${from.lng}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}${origin}&travelmode=driving`;
}

/** iframe src for an embedded map, or null when no key is configured. */
export function mapEmbedSrc(s, zoom = 15) {
  if (!GOOGLE_MAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(q(s))}&zoom=${zoom}`;
}

/** Static-style overview link for many stores at once (search by area). */
export function mapsAreaUrl(label = "prop rental stores Goregaon Film City Mumbai") {
  return `https://www.google.com/maps/search/${encodeURIComponent(label)}`;
}
