"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type AdminTheme = "light" | "dark";
const THEME_KEY = "yaqoob-admin-theme-v2";
const THEME_EVENT = "yaqoob-admin-theme-change";

function getServerTheme(): AdminTheme {
  return "light";
}

function readTheme(): AdminTheme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function applyTheme(theme: AdminTheme) {
  document.querySelector(".admin-root")?.setAttribute("data-admin-theme", theme);
}

export function AdminThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, getServerTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const next: AdminTheme = theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // The selection still applies for this page if browser storage is unavailable.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
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
