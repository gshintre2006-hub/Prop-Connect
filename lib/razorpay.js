/* Razorpay config shared with the client.
   The key id is public (it's sent to the browser to open Checkout); the secret
   lives only in the API routes. Without either, checkout runs in demo mode. */

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

export const isRazorpayConfigured = /^rzp_(test|live)_[A-Za-z0-9]+$/.test(RAZORPAY_KEY_ID);

export const isTestMode = RAZORPAY_KEY_ID.startsWith("rzp_test_");

/** Wait for checkout.js to define window.Razorpay (it loads async). */
export function waitForRazorpay(timeoutMs = 4000) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.Razorpay) return resolve(window.Razorpay);
    const start = Date.now();
    const t = setInterval(() => {
      if (window.Razorpay) { clearInterval(t); resolve(window.Razorpay); }
      else if (Date.now() - start > timeoutMs) { clearInterval(t); resolve(null); }
    }, 120);
  });
}
