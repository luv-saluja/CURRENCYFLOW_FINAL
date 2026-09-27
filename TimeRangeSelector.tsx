import { TIME_RANGES } from "../utils/constants";
import type { TimeRangeKey } from "../types/currency";

export function TimeRangeSelector({
  value,
  onChange,
}: {
  value: TimeRangeKey;
  onChange: (key: TimeRangeKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Chart time range">
      {TIME_RANGES.map((range) => {
        const active = range.key === value;
        return (
          <button
            key={range.key}
            type="button"
            onClick={() => onChange(range.key)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-ink text-paper dark:bg-brass-light dark:text-ink-deep"
                : "text-ink-muted hover:bg-paper-soft dark:text-paper/60 dark:hover:bg-white/5"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
