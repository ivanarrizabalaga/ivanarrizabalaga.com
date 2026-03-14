import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivanarrizabalaga.com";
const OG_IMAGE =
  "https://media-asgard.s3.eu-west-1.amazonaws.com/22/03/24/ae7bef5f-c719-4fd9-b2cf-e0f0617a0f15_ivan.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("siteTitle");
  const description = t("metaDescription");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Iván Arrizabalaga",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "Iván Arrizabalaga",
      title,
      description,
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_ES",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Iván Arrizabalaga" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    alternates: {
      languages: {
        en: "/",
        es: "/es",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
