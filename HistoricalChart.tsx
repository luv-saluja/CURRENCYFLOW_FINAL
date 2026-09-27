import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimeRangeKey } from "../types/currency";
import { useHistoricalRates } from "../hooks/useHistoricalRates";
import { TIME_RANGES } from "../utils/constants";
import { formatDateLabel, formatRate } from "../utils/formatCurrency";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { ErrorMessage } from "./ErrorMessage";
import { DataSourceBadge } from "./DataSourceBadge";
import { SpinnerIcon } from "./icons";

interface HistoricalChartProps {
  from: string;
  to: string;
}

interface TooltipPayloadItem {
  value: number;
  payload: { date: string; rate: number };
}

function ChartTooltip({
  active,
  payload,
  rangeDays,
  to,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  rangeDays: number;
  to: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-hairline bg-white px-3 py-2 text-sm shadow-card dark:border-hairline-dark dark:bg-ink-deep">
      <p className="text-ink-muted dark:text-paper/60">
        {formatDateLabel(point.date, rangeDays)}
      </p>
      <p className="tabular font-medium text-ink dark:text-paper">
        {formatRate(point.rate)} {to}
      </p>
    </div>
  );
}

export function HistoricalChart({ from, to }: HistoricalChartProps) {
  const [rangeKey, setRangeKey] = useState<TimeRangeKey>("1M");
  const range = TIME_RANGES.find((r) => r.key === rangeKey) ?? TIME_RANGES[2];
  const { points, loading, error, isMock, isSimulatedIntraday } = useHistoricalRates(
    from,
    to,
    range
  );

  const { high, low } = useMemo(() => {
    if (points.length === 0) return { high: null, low: null };
    let high = points[0];
    let low = points[0];
    for (const p of points) {
      if (p.rate > high.rate) high = p;
      if (p.rate < low.rate) low = p;
    }
    return { high, low };
  }, [points]);

  const domain = useMemo((): [number, number] => {
    if (points.length === 0) return [0, 1];
    const rates = points.map((p) => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const pad = (max - min) * 0.12 || max * 0.01 || 0.01;
    return [min - pad, max + pad];
  }, [points]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-ink dark:text-paper">
            {from}/{to} history
          </h2>
          {high && low && (
            <p className="tabular mt-0.5 text-sm text-ink-muted dark:text-paper/60">
              High {formatRate(high.rate)} · Low {formatRate(low.rate)}
            </p>
          )}
        </div>
        <TimeRangeSelector value={rangeKey} onChange={setRangeKey} />
      </div>

      {(isMock || isSimulatedIntraday) && (
        <div className="mb-3">
          <DataSourceBadge
            label={
              isSimulatedIntraday
                ? "Simulated intraday movement — daily data otherwise"
                : "Offline sample data"
            }
          />
        </div>
      )}

      {error ? (
        <ErrorMessage message={error} />
      ) : loading && points.length === 0 ? (
        <div className="flex h-72 items-center justify-center gap-2 text-sm text-ink-muted dark:text-paper/60">
          <SpinnerIcon className="text-brass" />
          Loading history…
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-hairline dark:text-hairline-dark"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => formatDateLabel(d, range.days)}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-ink-muted dark:text-paper/50"
                minTickGap={32}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={domain}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-ink-muted dark:text-paper/50"
                width={64}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatRate(v)}
              />
              <Tooltip content={<ChartTooltip rangeDays={range.days} to={to} />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#A7823B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
