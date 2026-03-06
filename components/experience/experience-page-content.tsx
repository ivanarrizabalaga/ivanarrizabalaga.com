"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ExperienceTimeline } from "./experience-timeline";

type Filter = "all" | "lead" | "ic";

type Props = { title: string };

export function ExperiencePageContent({ title }: Props) {
  const t = useTranslations("experience");
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <>
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="font-mono text-2xl font-bold md:text-3xl">{title}</h1>
        <div className="mt-4">
          <p className="mb-2 font-mono text-sm text-foreground/70">
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
      </div>
      <div className="mt-12">
        <ExperienceTimeline filter={filter} />
      </div>
    </>
  );
}
