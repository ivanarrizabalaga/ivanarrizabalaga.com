"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollEyes } from "@/hooks/use-scroll-eyes";

const EYE_OFFSET_MAX = 6;
const AVATAR_SIZE_MD = 320;

export type EyePosition = { x: number; y: number };

export type AvatarEyePositions = {
  left: EyePosition;
  right: EyePosition;
};

const DEFAULT_EYE_POSITIONS: AvatarEyePositions = {
  left: { x: 35, y: 42 },
  right: { x: 65, y: 42 },
};

type AvatarProps = {
  className?: string;
  /** Custom base positions for the eyes (in viewBox units, 0-100) */
  eyePositions?: AvatarEyePositions;
};

export function Avatar({ className, eyePositions = DEFAULT_EYE_POSITIONS }: AvatarProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const scrollOffset = useScrollEyes();
  const rafRef = useRef<number | undefined>(undefined);

  const updatePointerEyes = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
    const normalizedX = deltaX / distance;
    const normalizedY = deltaY / distance;

    const scale = Math.min(EYE_OFFSET_MAX, distance / 15);
    setPointerOffset({
      x: normalizedX * scale,
      y: normalizedY * scale,
    });
  }, []);

  useEffect(() => {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updatePointerEyes(lastX, lastY);
        rafRef.current = undefined;
      });
    };

    updatePointerEyes(lastX, lastY);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updatePointerEyes]);

  const leftEye = eyePositions.left;
  const rightEye = eyePositions.right;

  const totalOffsetX = pointerOffset.x + scrollOffset.x;
  const totalOffsetY = pointerOffset.y + scrollOffset.y;

  // Convert pixel offset to viewBox units (viewBox is 100x100)
  // Use md size for scale calc since ref reports rendered size
  const scale = 100 / AVATAR_SIZE_MD;
  const offsetX = totalOffsetX * scale;
  const offsetY = totalOffsetY * scale;

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 100 100"
      className={cn("select-none w-[240px] md:w-[320px] h-[240px] md:h-[320px]", className)}
      aria-hidden
    >
      {/* Character body - minimalist person at desk with screen */}
      <g fill="currentColor" className="text-foreground/70">
        {/* Head */}
        <ellipse cx="50" cy="38" rx="18" ry="20" />
        {/* Body/torso - simplified block */}
        <rect x="32" y="55" width="36" height="28" rx="4" />
        {/* Desk */}
        <rect x="20" y="78" width="60" height="6" rx="2" />
        {/* Screen/laptop */}
        <rect x="38" y="48" width="24" height="18" rx="2" fill="currentColor" className="text-foreground/50" />
        <line x1="50" y1="66" x2="50" y2="78" stroke="currentColor" strokeWidth="1.5" className="text-foreground/50" />
      </g>

      {/* Eyes - customizable position, animated by scroll + pointer */}
      <circle
        cx={leftEye.x}
        cy={leftEye.y}
        r="4"
        fill="currentColor"
        className="text-foreground transition-transform duration-150 ease-out"
        style={{ transform: `translate(${offsetX}, ${offsetY})` }}
      />
      <circle
        cx={rightEye.x}
        cy={rightEye.y}
        r="4"
        fill="currentColor"
        className="text-foreground transition-transform duration-150 ease-out"
        style={{ transform: `translate(${offsetX}, ${offsetY})` }}
      />
    </svg>
  );
}
