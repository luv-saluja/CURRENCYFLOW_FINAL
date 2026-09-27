import { useCallback, useEffect, useState } from "react";
import type { ConversionRecord, RateResult } from "../types/currency";
import { addConversion, clearRecentConversions, getRecentConversions } from "../services/database";

export function useRecentConversions() {
  const [records, setRecords] = useState<ConversionRecord[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const rows = await getRecentConversions();
    setRecords(rows);
  }, []);

  useEffect(() => {
    refresh()
      .catch(() => setRecords([]))
      .finally(() => setReady(true));
  }, [refresh]);

  const record = useCallback(
    async (result: RateResult) => {
      if (result.amount <= 0) return;
      await addConversion({
        fromCurrency: result.from,
        toCurrency: result.to,
        amount: result.amount,
        converted: result.converted,
        rate: result.rate,
        createdAt: result.asOf,
      });
      await refresh();
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    await clearRecentConversions();
    await refresh();
  }, [refresh]);

  return { records, ready, record, clear };
}
