import type { ThemeMode } from "../types/currency";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: ThemeMode;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-brass hover:text-brass dark:border-hairline-dark dark:text-paper dark:hover:border-brass-light dark:hover:text-brass-light"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
