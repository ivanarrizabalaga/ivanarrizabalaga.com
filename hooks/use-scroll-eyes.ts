"use client";

import { useCallback, useEffect, useState } from "react";

export type EyeOffset = { x: number; y: number };

const EYE_OFFSET_MAX = 6;
const SCROLL_FACTOR = 0.6;

/**
 * Returns an offset { x, y } for eye position based on scroll progress.
 * Eyes move downward as the user scrolls down the page.
 */
export function useScrollEyes(): EyeOffset {
  const [offset, setOffset] = useState<EyeOffset>({ x: 0, y: 0 });

  const updateOffset = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const scrollProgress = Math.min(1, scrollY / scrollHeight);
    const normalized = scrollProgress - 0.5;
    const yOffset = normalized * EYE_OFFSET_MAX * SCROLL_FACTOR;

    setOffset({ x: 0, y: yOffset });
  }, []);

  useEffect(() => {
    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => window.removeEventListener("scroll", updateOffset);
  }, [updateOffset]);

  return offset;
}
