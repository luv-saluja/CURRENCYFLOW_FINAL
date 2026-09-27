import type { HistoricalPoint } from "../types/currency";

/**
 * Approximate USD-per-unit reference rates, used only when the live API is
 * unreachable. These are illustrative, not live figures — the UI always
 * flags mock data clearly so nobody mistakes it for a real quote.
 */
export const MOCK_USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.925,
  GBP: 0.79,
  JPY: 149.5,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.15,
  HKD: 7.81,
  NZD: 1.66,
  SEK: 10.35,
  KRW: 1345,
  SGD: 1.34,
  NOK: 10.6,
  MXN: 17.1,
  INR: 83.4,
  ZAR: 18.2,
  TRY: 34.1,
  BRL: 5.1,
  DKK: 6.9,
  PLN: 3.95,
  THB: 35.6,
  IDR: 15750,
  HUF: 356,
  CZK: 22.9,
  ILS: 3.75,
  PHP: 56.8,
  MYR: 4.5,
  RON: 4.6,
  BGN: 1.81,
  ISK: 138,
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Cross rate derived from two USD-based reference rates. */
export function getMockRate(from: string, to: string): number {
  if (from === to) return 1;
  const fromRate = MOCK_USD_RATES[from] ?? 1;
  const toRate = MOCK_USD_RATES[to] ?? 1;
  return toRate / fromRate;
}

/**
 * Deterministic pseudo-random walk anchored to the mock cross rate, so the
 * chart still looks like a plausible market series when generated offline.
 */
export function generateMockSeries(
  from: string,
  to: string,
  days: number
): HistoricalPoint[] {
  const anchor = getMockRate(from, to);
  const points: HistoricalPoint[] = [];
  const today = new Date();
  let value = anchor * (1 - 0.015 * seededRandom(1));

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const drift = (seededRandom(i + from.length + to.charCodeAt(0)) - 0.5) * 0.006;
    value = Math.max(value * (1 + drift), anchor * 0.85);
    points.push({
      date: date.toISOString().slice(0, 10),
      rate: Number(value.toFixed(6)),
    });
  }

  // Anchor the final point to the actual mock latest rate so the "current"
  // value on the chart matches the converter above it.
  points[points.length - 1] = {
    date: points[points.length - 1].date,
    rate: anchor,
  };

  return points;
}
