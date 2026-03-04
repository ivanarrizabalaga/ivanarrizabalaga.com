"use client";

import { useLocale } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const fullPathname = useNextPathname();

  // Strip locale prefix - usePathname can return path with locale, causing double prefix
  const pathnameWithoutLocale =
    fullPathname?.replace(
      new RegExp(`^/(${routing.locales.join("|")})(/|$)`),
      "/"
    ) || "/";

  const switchTo = (newLocale: "en" | "es") => {
    if (newLocale === locale) return;
    // Pass locale in options so the cookie gets updated (required for as-needed routing)
    router.replace(pathnameWithoutLocale, { locale: newLocale });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex rounded-md border border-border p-0.5"
    >
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "rounded px-2.5 py-1 text-sm font-medium transition-colors",
          locale === "en"
            ? "bg-foreground text-background"
            : "bg-transparent text-foreground/70 hover:bg-accent hover:text-accent-foreground"
        )}
        aria-label="English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        onClick={() => switchTo("es")}
        className={cn(
          "rounded px-2.5 py-1 text-sm font-medium transition-colors",
          locale === "es"
            ? "bg-foreground text-background"
            : "bg-transparent text-foreground/70 hover:bg-accent hover:text-accent-foreground"
        )}
        aria-label="Español"
        aria-pressed={locale === "es"}
      >
        ES
      </button>
    </div>
  );
}
