import { CURRENCIES } from "../services/currencyMeta";
import { ChevronDownIcon } from "./icons";

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
  id: string;
  exclude?: string;
}

export function CurrencySelect({ value, onChange, label, id, exclude }: CurrencySelectProps) {
  const options = exclude ? CURRENCIES.filter((c) => c.code !== exclude) : CURRENCIES;
  const current = CURRENCIES.find((c) => c.code === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-ink-muted dark:text-paper/60">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg leading-none">
          {current?.flag ?? "🏳️"}
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-hairline bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-ink transition-colors hover:border-brass/50 focus:border-brass dark:border-hairline-dark dark:bg-ink-deep dark:text-paper"
        >
          {options.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-paper/50" />
      </div>
    </div>
  );
}
