import type { PropsWithChildren, ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  as?: "section" | "div";
}

export function Card({
  title,
  subtitle,
  action,
  className = "",
  as = "section",
  children,
}: PropsWithChildren<CardProps>) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-lg border border-hairline bg-white/70 shadow-card backdrop-blur-sm dark:border-hairline-dark dark:bg-white/[0.03] ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-5 pt-5 pb-4 dark:border-hairline-dark">
          <div>
            {title && (
              <h2 className="font-display text-lg font-medium text-ink dark:text-paper">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-ink-muted dark:text-paper/60">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Tag>
  );
}
