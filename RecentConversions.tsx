import type { ConversionRecord } from "../types/currency";
import { getCurrencyMeta } from "../services/currencyMeta";
import { formatAmount, formatTimestamp } from "../utils/formatCurrency";
import { ClockIcon, TrashIcon } from "./icons";

interface RecentConversionsProps {
  records: ConversionRecord[];
  onRepeat: (record: ConversionRecord) => void;
  onClear: () => void;
}

export function RecentConversions({ records, onRepeat, onClear }: RecentConversionsProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="text-ink-muted dark:text-paper/50" />
          <h2 className="font-display text-lg font-medium text-ink dark:text-paper">
            Recent conversions
          </h2>
        </div>
        {records.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-wine dark:text-paper/50 dark:hover:text-[#E39BA1]"
          >
            <TrashIcon width={14} height={14} />
            Clear
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-ink-muted dark:text-paper/60">
          Conversions you make will show up here for quick repeats.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {records.map((record) => {
            const from = getCurrencyMeta(record.fromCurrency);
            const to = getCurrencyMeta(record.toCurrency);
            return (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => onRepeat(record)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors hover:bg-paper-soft dark:hover:bg-white/5"
                >
                  <span className="tabular text-sm text-ink dark:text-paper">
                    {from.flag} {formatAmount(record.amount, record.fromCurrency)}
                    <span className="mx-1.5 text-ink-muted dark:text-paper/40">→</span>
                    {to.flag} {formatAmount(record.converted, record.toCurrency)}
                  </span>
                  <span className="text-xs text-ink-muted dark:text-paper/40">
                    {formatTimestamp(record.createdAt)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
