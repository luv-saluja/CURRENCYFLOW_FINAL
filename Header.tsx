import type { ThemeMode } from "../types/currency";
import { ThemeToggle } from "./ThemeToggle";

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle cx="12" cy="15" r="8.5" className="stroke-ink dark:stroke-paper" strokeWidth="1.4" />
      <circle cx="18" cy="15" r="8.5" className="stroke-brass" strokeWidth="1.4" />
    </svg>
  );
}

export function Header({ theme, onToggleTheme }: { theme: ThemeMode; onToggleTheme: () => void }) {
  return (
    <header className="border-b border-hairline dark:border-hairline-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Mark />
          <div>
            <p className="font-display text-xl leading-tight text-ink dark:text-paper">
              Currency Flow
            </p>
            <p className="text-sm text-ink-muted dark:text-paper/60">
              Live rates across 30 currencies
            </p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
