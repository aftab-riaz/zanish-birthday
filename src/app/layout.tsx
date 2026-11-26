import type { Metadata, Viewport } from "next";
import { Baloo_2, Poppins } from "next/font/google";
import { sajjiConfig } from "@/config/sajji";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: sajjiConfig.meta.title,
  description: sajjiConfig.meta.description,
  openGraph: {
    title: sajjiConfig.meta.title,
    description: sajjiConfig.meta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: sajjiConfig.meta.title,
    description: sajjiConfig.meta.description,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFD966",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
