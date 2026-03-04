"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EYE_OFFSET_MAX = 4;
const AVATAR_SIZE = 120;

export function Avatar({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const updateEyes = useCallback((clientX: number, clientY: number, scrollY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
    const normalizedX = deltaX / distance;
    const normalizedY = deltaY / distance;

    const pointerX = normalizedX * Math.min(EYE_OFFSET_MAX, distance / 20);
    const pointerY = normalizedY * Math.min(EYE_OFFSET_MAX, distance / 20);

    const scrollFactor = 0.5;
    const scrollNormalized = Math.min(1, scrollY / (window.innerHeight * 2));
    const scrollYOffset = (scrollNormalized - 0.5) * EYE_OFFSET_MAX * scrollFactor;

    setEyeOffset({
      x: pointerX,
      y: pointerY + scrollYOffset,
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateEyes(e.clientX, e.clientY, window.scrollY);
        rafRef.current = undefined;
      });
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const lastMouse = { current: { x: 0, y: 0 } };
        updateEyes(lastMouse.current.x || window.innerWidth / 2, lastMouse.current.y || window.innerHeight / 2, window.scrollY);
        rafRef.current = undefined;
      });
    };

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    const handleMouseMoveWithStore = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      handleMouseMove(e);
    };

    const throttledScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateEyes(lastX, lastY, window.scrollY);
        rafRef.current = undefined;
      });
    };

    window.addEventListener("mousemove", handleMouseMoveWithStore);
    window.addEventListener("scroll", throttledScroll, { passive: true });

    updateEyes(lastX, lastY, window.scrollY);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWithStore);
      window.removeEventListener("scroll", throttledScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateEyes]);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none", className)}
      aria-hidden
    >
      <div className="relative size-[120px] md:size-[140px]">
        <Image
          src="/logo_profile.png"
          alt=""
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className="size-full object-contain"
          priority
        />
        <div
          className="pointer-events-none absolute left-[32%] top-[42%] size-2 rounded-full bg-foreground transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          }}
        />
        <div
          className="pointer-events-none absolute left-[58%] top-[42%] size-2 rounded-full bg-foreground transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
