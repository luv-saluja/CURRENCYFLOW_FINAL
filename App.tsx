import { useCallback, useState } from "react";
import type { ConversionRecord, FavoritePair, RateResult } from "./types/currency";
import { useTheme } from "./hooks/useTheme";
import { useFavorites } from "./hooks/useFavorites";
import { useRecentConversions } from "./hooks/useRecentConversions";
import { DEFAULT_BASE_CURRENCY, DEFAULT_QUOTE_CURRENCY } from "./services/currencyMeta";
import { LOCAL_STORAGE_KEYS } from "./utils/constants";
import { Header } from "./components/Header";
import { Card } from "./components/Card";
import { CurrencyConverter } from "./components/CurrencyConverter";
import { HistoricalChart } from "./components/HistoricalChart";
import { TravelBudgetMode } from "./components/TravelBudgetMode";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { RecentConversions } from "./components/RecentConversions";

function loadLastPair(): { from: string; to: string } {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.lastPair);
    if (!raw) throw new Error("none");
    const parsed = JSON.parse(raw);
    if (typeof parsed.from === "string" && typeof parsed.to === "string") return parsed;
  } catch {
    // fall through to defaults
  }
  return { from: DEFAULT_BASE_CURRENCY, to: DEFAULT_QUOTE_CURRENCY };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { records, record, clear } = useRecentConversions();

  const initialPair = loadLastPair();
  const [from, setFrom] = useState(initialPair.from);
  const [to, setTo] = useState(initialPair.to);
  const [amount, setAmount] = useState("100");

  const persistPair = useCallback((nextFrom: string, nextTo: string) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.lastPair,
      JSON.stringify({ from: nextFrom, to: nextTo })
    );
  }, []);

  const handleFromChange = (code: string) => {
    setFrom(code);
    persistPair(code, to);
  };

  const handleToChange = (code: string) => {
    setTo(code);
    persistPair(from, code);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    persistPair(to, from);
  };

  const handleSelectFavorite = (pair: FavoritePair) => {
    setFrom(pair.from);
    setTo(pair.to);
    persistPair(pair.from, pair.to);
  };

  const handleRepeatConversion = (item: ConversionRecord) => {
    setFrom(item.fromCurrency);
    setTo(item.toCurrency);
    setAmount(String(item.amount));
    persistPair(item.fromCurrency, item.toCurrency);
  };

  const handleCommitConversion = useCallback(
    (result: RateResult) => {
      record(result).catch(() => {
        // Recording history is a convenience, not critical to the
        // conversion itself, so a storage failure stays silent.
      });
    },
    [record]
  );

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink-deep dark:text-paper">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CurrencyConverter
                from={from}
                to={to}
                amount={amount}
                onFromChange={handleFromChange}
                onToChange={handleToChange}
                onAmountChange={setAmount}
                onSwap={handleSwap}
                isFavorite={isFavorite(from, to)}
                onToggleFavorite={() => toggleFavorite(from, to)}
                onCommitConversion={handleCommitConversion}
              />
            </Card>

            <Card>
              <HistoricalChart from={from} to={to} />
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <TravelBudgetMode />
            </Card>
            <Card title="Favorites">
              <FavoritesPanel
                favorites={favorites}
                onSelect={handleSelectFavorite}
                onRemove={(pair) => toggleFavorite(pair.from, pair.to)}
              />
            </Card>
            <Card>
              <RecentConversions
                records={records}
                onRepeat={handleRepeatConversion}
                onClear={() => {
                  clear().catch(() => {
                    /* clearing is best-effort */
                  });
                }}
              />
            </Card>
          </div>
        </div>

        <footer className="mt-10 border-t border-hairline pt-6 text-sm text-ink-muted dark:border-hairline-dark dark:text-paper/50">
          <p>
            Live and historical rates from the Frankfurter API, sourced from the European
            Central Bank. If the service is unreachable, Currency Flow shows clearly labeled
            sample data so the app keeps working.
          </p>
        </footer>
      </main>
    </div>
  );
}
