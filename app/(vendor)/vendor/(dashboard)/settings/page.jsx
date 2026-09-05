import { AccountView } from "@/components/views/AccountView";

export const metadata = { title: "My profile · Vendor Portal" };

export default function VendorSettingsPage() {
  return (
    <AccountView
      title="My profile"
      subtitle="This is your personal sign-in profile — the same account you use to manage this store."
      signOutRedirect="/vendor/login"
    />
  );
}
