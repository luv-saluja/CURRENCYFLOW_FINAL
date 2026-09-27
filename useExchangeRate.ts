import { useEffect, useRef, useState } from "react";
import type { RateResult } from "../types/currency";
import { fetchLatestRate } from "../services/exchangeRateApi";
import { useDebounce } from "./useDebounce";

export interface UseExchangeRateState {
  result: RateResult | null;
  loading: boolean;
  error: string | null;
  validationError: string | null;
}

function validateAmount(raw: string): string | null {
  if (raw.trim() === "") return "Enter an amount to convert.";
  const value = Number(raw);
  if (Number.isNaN(value)) return "Enter a valid number.";
  if (value < 0) return "Amount can't be negative.";
  if (value === 0) return "Enter an amount greater than zero.";
  if (value > 1_000_000_000_000) return "That amount is too large to convert.";
  return null;
}

export function useExchangeRate(from: string, to: string, rawAmount: string) {
  const debouncedAmount = useDebounce(rawAmount, 350);
  const [state, setState] = useState<UseExchangeRateState>({
    result: null,
    loading: false,
    error: null,
    validationError: null,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const validationError = validateAmount(debouncedAmount);
    if (validationError) {
      setState((s) => ({ ...s, validationError, error: null, loading: false }));
      return;
    }

    const amount = Number(debouncedAmount);
    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null, validationError: null }));

    fetchLatestRate(from, to, amount, controller.signal)
      .then((result) => {
        if (currentRequest !== requestId.current) return;
        setState({ result, loading: false, error: null, validationError: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || currentRequest !== requestId.current) return;
        const message =
          error instanceof Error ? error.message : "Couldn't fetch the exchange rate.";
        setState({ result: null, loading: false, error: message, validationError: null });
      });

    return () => controller.abort();
  }, [from, to, debouncedAmount]);

  return state;
}
