import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "../types/currency";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(LOCAL_STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
