"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ExperienceTimeline } from "./experience-timeline";

type RoleFilter = "all" | "lead" | "ic";
type EntryFilter = "all" | "job" | "project";

type Props = { title: string };

export function ExperiencePageContent({ title }: Props) {
  const t = useTranslations("experience");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [entryFilter, setEntryFilter] = useState<EntryFilter>("all");

  // Reset Entry filter when leaving IC (it only applies when IC is selected)
  useEffect(() => {
    if (roleFilter !== "ic") {
      setEntryFilter("all");
    }
  }, [roleFilter]);

  return (
    <>
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-0">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
        <div className="mt-4">
          <p className="font-mono text-sm text-foreground/70">
            {t("explore")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-foreground/70">
              {t("filter.roleLabel")}:
            </span>
            {(["all", "lead", "ic"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
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
            {roleFilter === "ic" && (
              <>
                <span className="font-mono text-foreground/40" aria-hidden="true">
                  |
                </span>
<span className="font-mono text-xs text-foreground/70">
                {t("filter.entryLabel")}:
              </span>
                {(["all", "job", "project"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setEntryFilter(f)}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      entryFilter === f
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 hover:bg-foreground/20"
                    )}
                  >
                    {t(
                      `filter.entry${
                        f === "all" ? "All" : f === "job" ? "Job" : "Project"
                      }`
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <ExperienceTimeline roleFilter={roleFilter} entryFilter={entryFilter} />
      </div>
    </>
  );
}
