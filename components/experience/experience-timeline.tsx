"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo } from "react";
import Image from "next/image";
import { getTimelineItems, type TimelineItem } from "@/lib/experience-timeline";
import { matchesFilter } from "@/lib/role-classifier";
import { cn } from "@/lib/utils";

type Filter = "all" | "lead" | "ic";

export function ExperienceTimeline() {
  const t = useTranslations("experience");
  const locale = useLocale() as "en" | "es";
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => getTimelineItems(locale), [locale]);

  return (
    <div className="space-y-12">
      <div>
        <p className="mb-4 font-mono text-sm text-foreground/70">
          {t("explore")}
        </p>
        <div className="flex flex-wrap gap-2">
          {(["all", "lead", "ic"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-foreground/10 hover:bg-foreground/20"
              )}
            >
              {t(`filter.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Center line - full height */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border"
          aria-hidden
        />
        <div className="space-y-0">
          {items.map((item) => {
            const matches = matchesFilter(item.roleType, filter);
            const blur = !matches;
            const side =
              item.roleType === "lead"
                ? "left"
                : item.roleType === "ic"
                  ? "right"
                  : "both";
            return (
              <div
                key={item.id}
                className="relative flex min-h-[120px] items-center py-8"
              >
                {/* Date tick on the center line */}
                <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
                  <div className="size-3 shrink-0 rounded-full border-2 border-border bg-background" />
                  <span className="whitespace-nowrap font-mono text-xs text-foreground/60">
                    {formatDate(item.startDate, locale)}
                  </span>
                </div>
                <TimelineCard item={item} side={side} blur={blur} locale={locale} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  item,
  side,
  blur,
  locale,
}: {
  item: TimelineItem;
  side: "left" | "right" | "both";
  blur: boolean;
  locale: "en" | "es";
}) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = item.description.slice(0, 200) + (item.description.length > 200 ? "…" : "");

  return (
    <div
      className={cn(
        "relative z-10 w-full rounded-lg border border-border bg-background p-4 transition-all",
        side === "left" && "md:mr-auto md:max-w-[calc(50%-1.5rem)] md:pr-12",
        side === "right" && "md:ml-auto md:max-w-[calc(50%-1.5rem)] md:pl-12",
        side === "both" && "md:mx-4 md:max-w-[calc(100%-2rem)]",
        blur && "opacity-50 blur-sm"
      )}
    >
      <div className="flex items-start gap-4">
        {item.image && (
          <Image
            src={item.image}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded object-contain"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                {item.title}
              </a>
            ) : (
              <span className="font-semibold">{item.title}</span>
            )}
            <span className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-xs">
              {item.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground/70">{item.subtitle}</p>
          <p className="mt-2 text-xs text-foreground/50">
            {formatDate(item.startDate, locale)} —{" "}
            {item.endDate ? formatDate(item.endDate, locale) : "Present"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-foreground/80">
        {expanded ? item.description : shortDesc}
      </p>
      {item.description.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-foreground/70 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {item.competences.slice(0, 6).map((c) => (
          <span
            key={c}
            className="rounded bg-foreground/5 px-2 py-0.5 font-mono text-xs"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatDate(d: string, locale: "en" | "es"): string {
  return new Date(d).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
  });
}
