import { VendorLoginView } from "@/components/vendor/VendorLoginView";

export const metadata = { title: "Vendor sign in · PropConnect" };

export default function VendorLoginPage({ searchParams }) {
  const redirectTo =
    typeof searchParams?.redirectTo === "string" && searchParams.redirectTo.startsWith("/vendor")
      ? searchParams.redirectTo
      : "/vendor";
  const initialError = typeof searchParams?.error === "string" ? searchParams.error : "";
  return <VendorLoginView redirectTo={redirectTo} initialError={initialError} />;
}
