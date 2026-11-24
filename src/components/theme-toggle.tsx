"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Theme toggle drawn as a pull-cord lamp: lit in dark mode, off in light mode. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pulled, setPulled] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme !== "light";
  const label = mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme";

  function toggle() {
    setPulled(true);
    window.setTimeout(() => setPulled(false), 260);
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "group relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden="true">
        {/* glow, only when the lamp is on */}
        <circle
          cx="11"
          cy="15"
          r="7"
          className="fill-primary/0 transition-colors duration-500 dark:fill-primary/20"
        />
        <path
          d="M11 1.5v4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6 12.5c0-3.3 2.2-6 5-6s5 2.7 5 6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="fill-transparent transition-colors duration-500 dark:fill-primary/30"
        />
        <path
          d="M9.3 12.5a1.7 1.7 0 0 0 3.4 0"
          strokeWidth="1.5"
          className="stroke-current transition-colors duration-500 dark:stroke-primary"
        />
        {/* pull cord */}
        <g
          className={cn(
            "transition-transform duration-200 ease-out",
            pulled ? "translate-y-[2px]" : "translate-y-0",
          )}
        >
          <path
            d="M15 12.5v5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="15" cy="19" r="1.4" fill="currentColor" />
        </g>
      </svg>
    </button>
  );
}
