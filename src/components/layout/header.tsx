import type * as React from "react";

import { cn } from "../../lib/utils";

type HeaderProps = React.ComponentProps<"header"> & {
  title: React.ReactNode;
  /** Гарчгийн доор эсвэл хажууд гарах жижиг тайлбар. */
  subtitle?: React.ReactNode;
  /** Баруун талд байрлах товч, badge гэх мэт. */
  actions?: React.ReactNode;
};

export function Header({
  title,
  subtitle,
  actions,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn(
        "flex items-center justify-between gap-3 border-b border-line " +
          "bg-surface px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
        {subtitle && (
          <span className="shrink-0 text-xs text-ink-muted">{subtitle}</span>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
