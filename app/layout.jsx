import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "PropConnect — Find. Connect. Create.",
  description:
    "The unified prop sourcing network for Indian film production. Every rental prop, one search away.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#006078",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
