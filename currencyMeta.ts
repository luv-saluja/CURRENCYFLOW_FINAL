import type { CurrencyMeta } from "../types/currency";

/**
 * Currencies published by the Frankfurter API (sourced from the European
 * Central Bank's reference rates). Flags are the currency's primary issuing
 * region, not a claim about every country that uses it.
 */
export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Złoty", flag: "🇵🇱" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
  { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
  { code: "ISK", name: "Icelandic Króna", flag: "🇮🇸" },
];

const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrencyMeta(code: string): CurrencyMeta {
  return (
    CURRENCY_MAP.get(code) ?? { code, name: code, flag: "🏳️" }
  );
}

/** The five currencies shown side by side in Travel Budget mode. */
export const TRAVEL_BUDGET_TARGETS = ["USD", "EUR", "GBP", "JPY", "AUD"];

export const DEFAULT_BASE_CURRENCY = "USD";
export const DEFAULT_QUOTE_CURRENCY = "EUR";
