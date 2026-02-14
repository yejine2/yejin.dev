"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";
import { MESSAGES } from "@/constants/messages";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500"
        aria-hidden
      >
        <span className="h-4 w-4" />
      </span>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
      aria-label={
        isDark ? MESSAGES.THEME_SWITCH_TO_LIGHT : MESSAGES.THEME_SWITCH_TO_DARK
      }
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
