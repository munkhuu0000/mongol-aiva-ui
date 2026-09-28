import type * as React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/utils";

type SpinnerProps = React.ComponentProps<"svg">;

/** Эргэлддэг дүрс. Хэмжээ, өнгийг className-аар: <Spinner className="size-6 text-ink-muted" /> */
export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      data-slot="spinner"
      role="status"
      aria-label="Ачаалж байна"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export type { SpinnerProps };
