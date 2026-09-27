export function DataSourceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/30 bg-brass/[0.08] px-2.5 py-1 text-xs text-brass-dark dark:border-brass-light/30 dark:bg-brass-light/10 dark:text-brass-light">
      <span className="h-1.5 w-1.5 rounded-full bg-brass dark:bg-brass-light" />
      {label}
    </span>
  );
}
