export interface CurrencyMeta {
  code: string;
  name: string;
  flag: string;
}

export type TimeRangeKey = "1D" | "7D" | "1M" | "3M" | "6M" | "1Y" | "5Y";

export interface TimeRangeOption {
  key: TimeRangeKey;
  label: string;
  /** Approximate number of calendar days the range spans. */
  days: number;
}

export interface HistoricalPoint {
  date: string; // ISO date, e.g. 2026-09-27
  rate: number;
}

export interface RateResult {
  from: string;
  to: string;
  rate: number;
  amount: number;
  converted: number;
  asOf: string; // ISO timestamp
  isMock: boolean;
}

export interface ConversionRecord {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  converted: number;
  rate: number;
  createdAt: string; // ISO timestamp
}

export interface FavoritePair {
  from: string;
  to: string;
}

export type ThemeMode = "light" | "dark";

export interface ApiError {
  message: string;
}
