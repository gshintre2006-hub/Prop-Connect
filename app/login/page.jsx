import { LoginView } from "@/components/views/LoginView";

export const metadata = { title: "Sign in · PropConnect" };

export default function LoginPage({ searchParams }) {
  const redirectTo =
    typeof searchParams?.redirectTo === "string" && searchParams.redirectTo.startsWith("/")
      ? searchParams.redirectTo
      : "/";
  const initialError =
    typeof searchParams?.error === "string" ? searchParams.error : "";
  return <LoginView redirectTo={redirectTo} initialError={initialError} />;
}
