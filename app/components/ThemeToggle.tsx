"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * Dark/light toggle for the dashboard. Uses next-themes (class strategy).
 * Renders a stable placeholder until mounted to avoid a hydration mismatch,
 * since the resolved theme is only known on the client.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const base =
    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium " +
    "border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 " +
    "transition-all duration-200 cursor-pointer";

  if (!mounted) {
    // Placeholder keeps layout stable and markup identical on first paint.
    return (
      <button type="button" aria-label="Toggle dark mode" className={base} suppressHydrationWarning>
        <Moon className="w-[18px] h-[18px]" />
        <span>Dark mode</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={base}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
