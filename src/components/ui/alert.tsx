import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const alertVariants = cva(
  "flex items-start gap-2 rounded-md px-3 py-2 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "bg-info-soft text-info",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        // Газрын зураг, видео дээр давхарлаж харуулах бараан хувилбар —
        // ямар ч дэвсгэр дээр уншигдана.
        overlay: "bg-overlay/80 text-xs leading-snug text-overlay-fg backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /** Зүүн талын дүрс: <TriangleAlert />, <Info /> гэх мэт. */
    icon?: React.ReactNode;
  };

/**
 * Богино мэдэгдэл: алдаа, сануулга, тайлбар.
 *
 *   <Alert variant="danger" icon={<CircleAlert />}>Урсгал ачаалагдсангүй</Alert>
 */
export function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={variant === "danger" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export { alertVariants };
export type { AlertProps };
