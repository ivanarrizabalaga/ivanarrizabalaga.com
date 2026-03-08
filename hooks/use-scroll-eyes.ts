"use client";

import { useCallback, useEffect, useState } from "react";

const MOVEMENT_RANGE = 16; // -8px to +8px

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
    const newOffset = scrollPercent * MOVEMENT_RANGE - MOVEMENT_RANGE / 2;
    console.log("newOffset", newOffset);
    setOffset(newOffset);
  }, []);

  useEffect(() => {
    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => window.removeEventListener("scroll", updateOffset);
  }, [updateOffset]);

  return offset;
}
