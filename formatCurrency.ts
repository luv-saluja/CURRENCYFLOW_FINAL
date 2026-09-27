export function formatAmount(value: number, code: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: value >= 1000 ? 2 : 4,
    }).format(value);
  } catch {
    // Some currencies (or malformed codes) aren't in the Intl currency
    // table; fall back to a plain number with the code appended.
    return `${value.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${code}`;
  }
}

export function formatRate(rate: number): string {
  const decimals = rate >= 100 ? 2 : rate >= 1 ? 4 : 6;
  return rate.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDateLabel(iso: string, rangeDays: number): string {
  const date = new Date(iso);
  if (rangeDays <= 1) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (rangeDays <= 90) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
