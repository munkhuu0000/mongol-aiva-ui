import type * as React from "react";

import { cn } from "../../lib/utils";

type FooterProps = React.ComponentProps<"footer">;

export function Footer({ className, children, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-line " +
          "bg-surface px-4 py-2 text-xs text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}
