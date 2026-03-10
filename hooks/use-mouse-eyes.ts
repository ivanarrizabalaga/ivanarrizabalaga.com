"use client";

import { useCallback, useEffect, useState } from "react";

const EYE_OFFSET_MIN = -5;
const EYE_OFFSET_MAX = 5;

/**
 * Returns an X offset (in pixels) for eye position based on mouse position.
 * Uses the horizontal center of the viewport as relative 0: mouse left of
 * center moves eyes left, right of center moves eyes right. Clamped to [-5, 5].
 */
export function useMouseEyes(): number {
  const [offsetX, setOffsetX] = useState(0);

  const updateOffset = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const deltaX = e.clientX - centerX;
    const range = window.innerWidth / 2;
    const raw = range === 0 ? 0 : (deltaX / range) * EYE_OFFSET_MAX;
    const clamped = Math.max(EYE_OFFSET_MIN, Math.min(EYE_OFFSET_MAX, raw));
    setOffsetX(clamped);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateOffset, { passive: true });
    return () => window.removeEventListener("mousemove", updateOffset);
  }, [updateOffset]);

  return offsetX;
}
