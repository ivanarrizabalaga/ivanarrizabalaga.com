import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivanarrizabalaga.com";

const staticPaths = ["", "experience", "skills", "contact", "writing", "talk-to-ivo"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

    for (const path of staticPaths) {
      const pathSegment = path ? `/${path}` : "";
      entries.push({
        url: `${SITE_URL}${prefix}${pathSegment}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
