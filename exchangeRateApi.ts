import type { HistoricalPoint, RateResult, TimeRangeOption } from "../types/currency";
import { FRANKFURTER_BASE_URL } from "../utils/constants";
import { generateMockSeries, getMockRate } from "../utils/mockData";

export class ExchangeRateApiError extends Error {}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ExchangeRateApiError(
      `The exchange rate service returned an error (${response.status}).`
    );
  }
  return response.json() as Promise<T>;
}

interface FrankfurterLatest {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface FrankfurterSeries {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

/**
 * Fetches a single live conversion. Falls back to deterministic mock data
 * (clearly flagged via `isMock`) if the network request fails, so the app
 * keeps working offline or in restricted development environments.
 */
export async function fetchLatestRate(
  from: string,
  to: string,
  amount: number,
  signal?: AbortSignal
): Promise<RateResult> {
  if (from === to) {
    return {
      from,
      to,
      rate: 1,
      amount,
      converted: amount,
      asOf: new Date().toISOString(),
      isMock: false,
    };
  }

  try {
    const url = `${FRANKFURTER_BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`;
    const data = await getJson<FrankfurterLatest>(url, signal);
    const converted = data.rates[to];
    if (typeof converted !== "number") {
      throw new ExchangeRateApiError(`No rate returned for ${from} → ${to}.`);
    }
    return {
      from,
      to,
      rate: converted / amount,
      amount,
      converted,
      asOf: new Date(`${data.date}T00:00:00Z`).toISOString(),
      isMock: false,
    };
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    const rate = getMockRate(from, to);
    return {
      from,
      to,
      rate,
      amount,
      converted: Number((rate * amount).toFixed(6)),
      asOf: new Date().toISOString(),
      isMock: true,
    };
  }
}

/** Latest rate from one base currency to several targets in a single call. */
export async function fetchLatestMulti(
  from: string,
  targets: string[],
  amount: number,
  signal?: AbortSignal
): Promise<{ rates: Record<string, number>; isMock: boolean; asOf: string }> {
  const wanted = targets.filter((t) => t !== from);
  try {
    if (wanted.length === 0) {
      return { rates: { [from]: amount }, isMock: false, asOf: new Date().toISOString() };
    }
    const url = `${FRANKFURTER_BASE_URL}/latest?amount=${amount}&from=${from}&to=${wanted.join(",")}`;
    const data = await getJson<FrankfurterLatest>(url, signal);
    const rates: Record<string, number> = { ...data.rates };
    if (targets.includes(from)) rates[from] = amount;
    return { rates, isMock: false, asOf: new Date(`${data.date}T00:00:00Z`).toISOString() };
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    const rates: Record<string, number> = {};
    for (const target of targets) {
      rates[target] = Number((getMockRate(from, target) * amount).toFixed(6));
    }
    return { rates, isMock: true, asOf: new Date().toISOString() };
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Builds a plausible simulated intraday path anchored to a real closing rate. */
function generateIntradaySeries(anchorRate: number): HistoricalPoint[] {
  const points: HistoricalPoint[] = [];
  const now = new Date();
  let value = anchorRate * 0.998;
  for (let hour = 24; hour >= 0; hour--) {
    const t = new Date(now.getTime() - hour * 60 * 60 * 1000);
    const wobble = (Math.sin(hour * 1.3) + Math.sin(hour * 0.4)) * 0.0006;
    value = anchorRate * (1 + wobble);
    points.push({ date: t.toISOString(), rate: Number(value.toFixed(6)) });
  }
  points[points.length - 1] = { date: now.toISOString(), rate: anchorRate };
  return points;
}

export interface HistoricalSeriesResult {
  points: HistoricalPoint[];
  isMock: boolean;
  /** True only for the simulated-intraday 1D case layered on a real rate. */
  isSimulatedIntraday: boolean;
}

/**
 * Historical series for a currency pair. Frankfurter only has daily
 * granularity, so the "1D" range is a simulated intraday path anchored to
 * the real latest close; every other range is genuine historical data.
 */
export async function fetchHistoricalSeries(
  from: string,
  to: string,
  range: TimeRangeOption,
  signal?: AbortSignal
): Promise<HistoricalSeriesResult> {
  if (from === to) {
    const flat = generateMockSeries(from, to, range.days).map((p) => ({ ...p, rate: 1 }));
    return { points: flat, isMock: false, isSimulatedIntraday: false };
  }

  if (range.key === "1D") {
    try {
      const latest = await fetchLatestRate(from, to, 1, signal);
      return {
        points: generateIntradaySeries(latest.rate),
        isMock: latest.isMock,
        isSimulatedIntraday: true,
      };
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") throw error;
      return {
        points: generateIntradaySeries(getMockRate(from, to)),
        isMock: true,
        isSimulatedIntraday: true,
      };
    }
  }

  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - range.days);
    const url = `${FRANKFURTER_BASE_URL}/${toIsoDate(start)}..${toIsoDate(end)}?from=${from}&to=${to}`;
    const data = await getJson<FrankfurterSeries>(url, signal);
    const points: HistoricalPoint[] = Object.entries(data.rates)
      .map(([date, rates]) => ({ date, rate: rates[to] }))
      .filter((p) => typeof p.rate === "number")
      .sort((a, b) => a.date.localeCompare(b.date));

    if (points.length === 0) {
      throw new ExchangeRateApiError("The service returned no historical points.");
    }
    return { points, isMock: false, isSimulatedIntraday: false };
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    return {
      points: generateMockSeries(from, to, range.days),
      isMock: true,
      isSimulatedIntraday: false,
    };
  }
}
