"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Avatar } from "@/components/avatar/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", key: "home" },
  { href: "/experience", key: "experience" },
  { href: "/skills", key: "skills" },
  { href: "/writing", key: "writing" },
  { href: "/contact", key: "contact" },
  { href: "/talk-to-ivo", key: "talkToIvo" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const resumePdfUrl = `/api/resume.pdf?locale=${locale}`;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[360px] flex-col overflow-hidden border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:flex">
      <div className="flex flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto px-6 py-8">
        {/* Name */}
        <Link href="/" className="font-mono text-lg font-semibold">
          Ivan Arrizabalaga
        </Link>

        {/* Theme + Locale */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "rounded-md px-3 py-2 font-mono text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === href ? "bg-accent text-foreground" : "text-foreground/70"
              )}
            >
              {t(key)}
            </Link>
          ))}
          <a
            href={resumePdfUrl}
            download
            className={cn(
              "rounded-md px-3 py-2 font-mono text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              "text-foreground/70"
            )}
            aria-label={t("downloadResume")}
          >
            {t("downloadResume")}
          </a>
        </nav>

        {/* Avatar - 24px horizontal padding, max 360px */}
        <div className="mt-auto overflow-hidden pt-8">
          <Avatar className="w-full max-w-[360px] opacity-60" />
        </div>
      </div>
    </aside>
  );
}
