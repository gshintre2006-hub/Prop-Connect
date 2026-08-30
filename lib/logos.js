/* ---------------------------------------------------------------------- */
/*  BRAND ARTWORK                                                          */
/*                                                                        */
/*  The client supplied two base64 PNG data URIs in the original file:    */
/*    - LOGO_FULL : the complete stacked lockup (mark + wordmark + tag)   */
/*    - LOGO_MARK : the icon-only crop, used in the slim navbar           */
/*                                                                        */
/*  Those strings are ~30 KB each and are omitted here. Paste the exact   */
/*  `const LOGO_FULL = "data:image/png;base64,..."` and `const LOGO_MARK  */
/*  = "data:image/png;base64,..."` values from your original React file   */
/*  over the two placeholders below. Everything else already wires up to  */
/*  these exports — no other change needed.                               */
/* ---------------------------------------------------------------------- */

// 1x1 transparent PNG placeholders so the app renders before you paste the real art.
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const LOGO_FULL = TRANSPARENT_PNG; // <-- replace with the real LOGO_FULL data URI
export const LOGO_MARK = TRANSPARENT_PNG; // <-- replace with the real LOGO_MARK data URI
