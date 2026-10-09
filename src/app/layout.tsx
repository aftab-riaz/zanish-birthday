import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import { birthdayConfig } from "@/config/birthday";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// On Vercel the production URL is picked up automatically; set
// NEXT_PUBLIC_SITE_URL if you use a custom domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: birthdayConfig.meta.title,
  description: birthdayConfig.meta.description,
  openGraph: {
    title: birthdayConfig.meta.title,
    description: birthdayConfig.meta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: birthdayConfig.meta.title,
    description: birthdayConfig.meta.description,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#EFE4F9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
