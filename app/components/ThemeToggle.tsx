"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  const applyTheme = (value: Theme) => {
    localStorage.setItem("theme", value);
    document.documentElement.dataset.theme = value;
    setTheme(value);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const next: Theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    applyTheme(next);
  }, []);

  function toggleTheme() {
    const next: Theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      className="shrink-0 rounded-full border border-black/15 bg-black/5 px-3 py-1.5 text-xs text-foreground backdrop-blur-sm hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
