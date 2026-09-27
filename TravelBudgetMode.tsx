import { useState } from "react";
import { useTravelBudget } from "../hooks/useTravelBudget";
import { getCurrencyMeta, TRAVEL_BUDGET_TARGETS } from "../services/currencyMeta";
import { formatAmount } from "../utils/formatCurrency";
import { CurrencySelect } from "./CurrencySelect";
import { ErrorMessage } from "./ErrorMessage";
import { DataSourceBadge } from "./DataSourceBadge";
import { PlaneIcon, SpinnerIcon } from "./icons";

export function TravelBudgetMode() {
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const { rates, loading, error, validationError, isMock } = useTravelBudget(
    homeCurrency,
    amount
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <PlaneIcon className="text-brass" />
        <h2 className="font-display text-lg font-medium text-ink dark:text-paper">
          Travel budget
        </h2>
      </div>
      <p className="mb-4 text-sm text-ink-muted dark:text-paper/60">
        See one amount across five major currencies before you go.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="travel-amount" className="text-sm text-ink-muted dark:text-paper/60">
            Budget
          </label>
          <input
            id="travel-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tabular w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm font-medium text-ink focus:border-brass dark:border-hairline-dark dark:bg-ink-deep dark:text-paper"
          />
        </div>
        <CurrencySelect
          id="travel-home-currency"
          label="In"
          value={homeCurrency}
          onChange={setHomeCurrency}
        />
      </div>

      {validationError ? (
        <ErrorMessage message={validationError} />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="divide-y divide-hairline dark:divide-hairline-dark">
          {TRAVEL_BUDGET_TARGETS.map((code) => {
            const meta = getCurrencyMeta(code);
            const value = rates[code];
            return (
              <div key={code} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{meta.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-paper">{code}</p>
                    <p className="text-xs text-ink-muted dark:text-paper/50">{meta.name}</p>
                  </div>
                </div>
                <span className="tabular text-sm font-medium text-ink dark:text-paper">
                  {loading && value === undefined ? (
                    <SpinnerIcon width={16} height={16} className="text-brass" />
                  ) : value !== undefined ? (
                    formatAmount(value, code)
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isMock && !validationError && !error && (
        <div className="mt-3">
          <DataSourceBadge label="Offline sample rates" />
        </div>
      )}
    </div>
  );
}
