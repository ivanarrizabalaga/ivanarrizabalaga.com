"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useScrollEyes } from "@/hooks/use-scroll-eyes";

const ASSETS = {
  light: {
    base: "/base_light.png",
    eyes: "/eyes_light.png",
  },
  dark: {
    base: "/base_dark.png",
    eyes: "/eyes_dark.png",
  },
} as const;

type AvatarProps = {
  className?: string;
};

export function Avatar({ className }: AvatarProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const eyeOffset = useScrollEyes();

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const { base, eyes } = ASSETS[theme];

  return (
    <div
      className={cn(
        "relative w-full select-none overflow-visible",
        className
      )}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <img
        src={base}
        alt="Avatar"
        className="block w-full h-auto"
      />
      <img
        src={eyes}
        alt=""
        aria-hidden
        className="block w-full h-auto absolute top-0 left-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${eyeOffset}px)` }}
      />
    </div>
  );
}
