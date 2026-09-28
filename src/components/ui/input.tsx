import type * as React from "react";

import { cn } from "../../lib/utils";

type InputProps = React.ComponentProps<"input">;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-line bg-surface px-3 text-sm text-ink " +
          "placeholder:text-ink-muted " +
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary " +
          "disabled:cursor-not-allowed disabled:opacity-50 " +
          "aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}

export type { InputProps };
