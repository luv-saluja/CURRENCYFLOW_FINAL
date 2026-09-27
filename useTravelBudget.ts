import { useEffect, useRef, useState } from "react";
import { fetchLatestMulti } from "../services/exchangeRateApi";
import { TRAVEL_BUDGET_TARGETS } from "../services/currencyMeta";
import { useDebounce } from "./useDebounce";

export interface TravelBudgetState {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  validationError: string | null;
  isMock: boolean;
  asOf: string | null;
}

function validateAmount(raw: string): string | null {
  if (raw.trim() === "") return "Enter an amount to budget.";
  const value = Number(raw);
  if (Number.isNaN(value)) return "Enter a valid number.";
  if (value <= 0) return "Enter an amount greater than zero.";
  if (value > 1_000_000_000_000) return "That amount is too large to convert.";
  return null;
}

export function useTravelBudget(homeCurrency: string, rawAmount: string) {
  const debouncedAmount = useDebounce(rawAmount, 350);
  const [state, setState] = useState<TravelBudgetState>({
    rates: {},
    loading: false,
    error: null,
    validationError: null,
    isMock: false,
    asOf: null,
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

    fetchLatestMulti(homeCurrency, TRAVEL_BUDGET_TARGETS, amount, controller.signal)
      .then(({ rates, isMock, asOf }) => {
        if (currentRequest !== requestId.current) return;
        setState({ rates, loading: false, error: null, validationError: null, isMock, asOf });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || currentRequest !== requestId.current) return;
        const message =
          error instanceof Error ? error.message : "Couldn't load travel budget rates.";
        setState({
          rates: {},
          loading: false,
          error: message,
          validationError: null,
          isMock: false,
          asOf: null,
        });
      });

    return () => controller.abort();
  }, [homeCurrency, debouncedAmount]);

  return state;
}
