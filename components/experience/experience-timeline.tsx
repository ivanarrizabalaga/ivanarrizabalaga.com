"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { getTimelineItems, type TimelineItem } from "@/lib/experience-timeline";
import { matchesFilter } from "@/lib/role-classifier";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | "lead" | "ic";
type EntryFilter = "all" | "job" | "project";

type ExperienceTimelineProps = {
  roleFilter?: RoleFilter;
  entryFilter?: EntryFilter;
};

export function ExperienceTimeline({
  roleFilter: roleFilterProp,
  entryFilter: entryFilterProp,
}: ExperienceTimelineProps = {}) {
  const t = useTranslations("experience");
  const locale = useLocale() as "en" | "es";
  const [internalRoleFilter, setInternalRoleFilter] = useState<RoleFilter>("all");
  const [internalEntryFilter, setInternalEntryFilter] = useState<EntryFilter>("all");
  const roleFilter = roleFilterProp ?? internalRoleFilter;
  const entryFilter = entryFilterProp ?? internalEntryFilter;

  const items = useMemo(() => getTimelineItems(locale), [locale]);

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesRole = matchesFilter(item.roleType, roleFilter);
        const matchesEntry =
          entryFilter === "all" || item.type === entryFilter;
        return matchesRole && matchesEntry;
      }),
    [items, roleFilter, entryFilter]
  );

  return (
    <div className="space-y-12">
      {roleFilterProp === undefined && entryFilterProp === undefined && (
        <div>
          <p className="mb-4 font-mono text-sm text-foreground/70">
            {t("explore")}
          </p>
          <div className="flex flex-wrap gap-2">
            {(["all", "lead", "ic"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setInternalRoleFilter(f)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  roleFilter === f
                    ? "bg-foreground text-background"
                    : "bg-foreground/10 hover:bg-foreground/20"
                )}
              >
                {t(`filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        {/* CSS ladder: two vertical rails + repeating rungs */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 flex justify-between pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 47px, var(--timeline-ladder) 47px 48px)`,
          }}
          aria-hidden
        >
          <div className="w-px bg-[var(--timeline-ladder)]" />
          <div className="w-px bg-[var(--timeline-ladder)]" />
        </div>
        <div className="space-y-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleItems.map((item) => {
              const side =
                item.roleType === "lead"
                  ? "left"
                  : item.roleType === "ic"
                    ? "right"
                    : "both";
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    scale: 1.08,
                    filter: "blur(6px)",
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  }}
                  transition={{
                    layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                  }}
                  className="relative py-8 first:pt-0"
                >
                  {/* Date as subtle header between rows */}
                  <div className="mb-4 flex justify-center">
                    <span className="whitespace-nowrap font-mono text-xs text-foreground/50">
                      {item.endDate
                        ? formatDate(item.endDate, locale)
                        : "Present"}
                    </span>
                  </div>
                  <div className="relative flex min-h-[80px] items-start">
                    <TimelineCard item={item} side={side} locale={locale} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  item,
  side,
  locale,
}: {
  item: TimelineItem;
  side: "left" | "right" | "both";
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
        side === "both" && "md:mx-4 md:max-w-[calc(100%-2rem)]"
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
          <p className="mt-1 text-base text-foreground/70">{item.subtitle}</p>
          <p className="mt-2 text-xs text-foreground/50">
            {formatDate(item.startDate, locale)} —{" "}
            {item.endDate ? formatDate(item.endDate, locale) : "Present"}
          </p>
        </div>
      </div>
      <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:!text-foreground prose-a:text-foreground prose-a:underline hover:prose-a:text-foreground/80 prose-ul:my-2 prose-li:my-0">
        <ReactMarkdown>{expanded ? item.description : shortDesc}</ReactMarkdown>
      </div>
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
