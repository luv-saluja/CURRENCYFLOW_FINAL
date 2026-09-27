import { useEffect, useRef, useState } from "react";
import type { HistoricalPoint, TimeRangeOption } from "../types/currency";
import { fetchHistoricalSeries } from "../services/exchangeRateApi";

export interface UseHistoricalRatesState {
  points: HistoricalPoint[];
  loading: boolean;
  error: string | null;
  isMock: boolean;
  isSimulatedIntraday: boolean;
}

export function useHistoricalRates(from: string, to: string, range: TimeRangeOption) {
  const [state, setState] = useState<UseHistoricalRatesState>({
    points: [],
    loading: true,
    error: null,
    isMock: false,
    isSimulatedIntraday: false,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchHistoricalSeries(from, to, range, controller.signal)
      .then(({ points, isMock, isSimulatedIntraday }) => {
        if (currentRequest !== requestId.current) return;
        setState({ points, loading: false, error: null, isMock, isSimulatedIntraday });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || currentRequest !== requestId.current) return;
        const message =
          error instanceof Error ? error.message : "Couldn't load historical rates.";
        setState({
          points: [],
          loading: false,
          error: message,
          isMock: false,
          isSimulatedIntraday: false,
        });
      });

    return () => controller.abort();
  }, [from, to, range]);

  return state;
}
