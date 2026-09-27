import type { FavoritePair } from "../types/currency";
import { getCurrencyMeta } from "../services/currencyMeta";
import { StarIcon } from "./icons";

interface FavoritesPanelProps {
  favorites: FavoritePair[];
  onSelect: (pair: FavoritePair) => void;
  onRemove: (pair: FavoritePair) => void;
}

export function FavoritesPanel({ favorites, onSelect, onRemove }: FavoritesPanelProps) {
  if (favorites.length === 0) {
    return (
      <p className="text-sm text-ink-muted dark:text-paper/60">
        Star a currency pair in the converter to pin it here for one-tap access.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {favorites.map((pair) => {
        const from = getCurrencyMeta(pair.from);
        const to = getCurrencyMeta(pair.to);
        return (
          <li key={`${pair.from}-${pair.to}`} className="group flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(pair)}
              className="flex flex-1 items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-paper-soft dark:text-paper dark:hover:bg-white/5"
            >
              <span className="tabular">
                {from.flag} {pair.from} → {to.flag} {pair.to}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(pair)}
              aria-label={`Remove ${pair.from} to ${pair.to} from favorites`}
              className="rounded-md p-1.5 text-brass opacity-0 transition-opacity hover:bg-brass/10 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <StarIcon filled width={16} height={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
