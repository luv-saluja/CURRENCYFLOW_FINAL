import type { TimeRangeOption } from "../types/currency";

export const TIME_RANGES: TimeRangeOption[] = [
  { key: "1D", label: "1D", days: 1 },
  { key: "7D", label: "7D", days: 7 },
  { key: "1M", label: "1M", days: 30 },
  { key: "3M", label: "3M", days: 90 },
  { key: "6M", label: "6M", days: 182 },
  { key: "1Y", label: "1Y", days: 365 },
  { key: "5Y", label: "5Y", days: 1825 },
];

export const FRANKFURTER_BASE_URL = "https://api.frankfurter.app";

export const LOCAL_STORAGE_KEYS = {
  theme: "currency-flow-theme",
  favorites: "currency-flow-favorites",
  sqliteDb: "currency-flow-sqlite-db",
  lastPair: "currency-flow-last-pair",
} as const;
