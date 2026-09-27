import { useState } from "react";
import { SwapIcon } from "./icons";

export function SwapButton({ onSwap }: { onSwap: () => void }) {
  const [spinning, setSpinning] = useState(false);

  return (
    <button
      type="button"
      aria-label="Swap currencies"
      onClick={() => {
        setSpinning(true);
        onSwap();
        setTimeout(() => setSpinning(false), 300);
      }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-white text-ink transition-colors hover:border-brass hover:text-brass dark:border-hairline-dark dark:bg-ink-deep dark:text-paper dark:hover:border-brass-light dark:hover:text-brass-light"
    >
      <SwapIcon className={spinning ? "animate-swap-spin" : ""} />
    </button>
  );
}
