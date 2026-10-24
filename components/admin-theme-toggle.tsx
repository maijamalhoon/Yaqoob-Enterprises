"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type AdminTheme = "light" | "dark";
const THEME_KEY = "yaqoob-admin-theme-v2";

function applyTheme(theme: AdminTheme) {
  document.querySelector(".admin-root")?.setAttribute("data-admin-theme", theme);
}

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<AdminTheme>("light");

  useEffect(() => {
    let saved: AdminTheme = "light";
    try {
      saved = window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      // Theme remains usable for this session if browser storage is unavailable.
    }
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function toggleTheme() {
    const next: AdminTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // The selected theme still applies until this page is refreshed.
    }
  }

  return (
    <button
      className="admin-theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun size={18} strokeWidth={1.9} aria-hidden="true" />
        : <Moon size={18} strokeWidth={1.9} aria-hidden="true" />}
    </button>
  );
}
