"use client";

import { useCallback, useEffect, useState } from "react";

const EYE_OFFSET_MIN = -2.3; // top of scroll (eyes higher)
const EYE_OFFSET_MAX = 7; // bottom of scroll (eyes lower)

/**
 * Returns a Y offset (in pixels) for eye position based on scroll progress.
 * Eyes move downward as the user scrolls down the page.
 * Uses GPU-friendly values for transform: translateY().
 */
export function useScrollEyes(): number {
  const [offset, setOffset] = useState(0);

  const updateOffset = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) {
      setOffset(0);
      return;
    }

    const scrollPercent = scrollY / scrollHeight;
    const newOffset = EYE_OFFSET_MIN + scrollPercent * (EYE_OFFSET_MAX - EYE_OFFSET_MIN);
    setOffset(newOffset);
  }, []);

  useEffect(() => {
    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => window.removeEventListener("scroll", updateOffset);
  }, [updateOffset]);

  return offset;
}
