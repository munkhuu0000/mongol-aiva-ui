import type * as React from "react";

import { cn } from "../../lib/utils";

type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Доор гарах товч: "Камер нэмэх" гэх мэт. */
  action?: React.ReactNode;
};

/**
 * Харуулах зүйлгүй үеийн хоосон төлөв: камер сонгоогүй, үр дүн олдсонгүй.
 *
 *   <EmptyState icon={<Video />} title="Камер сонгоно уу" />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 p-6 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-line-soft text-ink-muted [&>svg]:size-5">
          {icon}
        </div>
      )}
      <div className="text-sm font-medium text-ink">{title}</div>
      {description && <div className="max-w-xs text-xs text-ink-muted">{description}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export type { EmptyStateProps };
