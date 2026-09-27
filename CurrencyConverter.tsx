import { useEffect, useRef } from "react";
import type { RateResult } from "../types/currency";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { formatAmount, formatRate, formatTimestamp } from "../utils/formatCurrency";
import { CurrencySelect } from "./CurrencySelect";
import { SwapButton } from "./SwapButton";
import { StarIcon, SpinnerIcon } from "./icons";
import { ErrorMessage } from "./ErrorMessage";
import { DataSourceBadge } from "./DataSourceBadge";

interface CurrencyConverterProps {
  from: string;
  to: string;
  amount: string;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onAmountChange: (value: string) => void;
  onSwap: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCommitConversion: (result: RateResult) => void;
}

export function CurrencyConverter({
  from,
  to,
  amount,
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
  isFavorite,
  onToggleFavorite,
  onCommitConversion,
}: CurrencyConverterProps) {
  const { result, loading, error, validationError } = useExchangeRate(from, to, amount);
  const shouldCommit = useRef(false);

  useEffect(() => {
    if (!loading && result && shouldCommit.current) {
      onCommitConversion(result);
      shouldCommit.current = false;
    }
  }, [result, loading, onCommitConversion]);

  const commitNow = () => {
    shouldCommit.current = true;
    if (!loading && result) {
      onCommitConversion(result);
      shouldCommit.current = false;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink dark:text-paper">
            Convert
          </h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-paper/60">
            Rates from the European Central Bank, updated on every business day.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-brass transition-colors hover:border-brass dark:border-hairline-dark"
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>

      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-3">
          <CurrencySelect id="from-currency" label="From" value={from} onChange={onFromChange} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-sm text-ink-muted dark:text-paper/60">
              Amount
            </label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              onBlur={commitNow}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitNow();
              }}
              placeholder="0.00"
              aria-invalid={Boolean(validationError)}
              className="tabular w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-lg font-medium text-ink transition-colors focus:border-brass dark:border-hairline-dark dark:bg-ink-deep dark:text-paper"
            />
          </div>
        </div>

        <div className="flex justify-center pb-2.5 sm:pb-1">
          <SwapButton
            onSwap={() => {
              shouldCommit.current = true;
              onSwap();
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CurrencySelect id="to-currency" label="To" value={to} onChange={onToChange} />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-muted dark:text-paper/60">Converted</span>
            <div className="flex min-h-[46px] items-center rounded-md border border-hairline bg-paper-soft px-3.5 py-2.5 dark:border-hairline-dark dark:bg-white/[0.04]">
              {validationError ? (
                <span className="text-sm text-ink-muted dark:text-paper/50">—</span>
              ) : result ? (
                <span className="tabular font-display text-lg text-ink dark:text-paper">
                  {formatAmount(result.converted, to)}
                </span>
              ) : (
                <span className="text-sm text-ink-muted dark:text-paper/50">Converting…</span>
              )}
              {loading && <SpinnerIcon className="ml-2 text-brass" width={16} height={16} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted dark:text-paper/60">
        {result && !validationError && (
          <>
            <span className="tabular">
              1 {from} = {formatRate(result.rate)} {to}
            </span>
            <span>Updated {formatTimestamp(result.asOf)}</span>
            {result.isMock && <DataSourceBadge label="Offline sample rate" />}
          </>
        )}
      </div>

      {validationError && (
        <div className="mt-4">
          <ErrorMessage message={validationError} />
        </div>
      )}
      {error && !validationError && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}
    </div>
  );
}
