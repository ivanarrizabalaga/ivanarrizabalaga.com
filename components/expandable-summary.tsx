"use client";

import { useState } from "react";

type Props = {
  summary: string;
  showMoreLabel: string;
  showLessLabel: string;
  className?: string;
};

export function ExpandableSummary({
  summary,
  showMoreLabel,
  showLessLabel,
  className = "",
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <p
        className={
          expanded
            ? "text-sm text-foreground/70"
            : "line-clamp-3 text-sm text-foreground/70"
        }
      >
        {summary}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="mt-1 font-mono text-xs text-foreground/60 underline hover:text-foreground"
      >
        {expanded ? showLessLabel : showMoreLabel}
      </button>
    </div>
  );
}
