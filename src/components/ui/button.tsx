import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  // Бүх хувилбарт нийтлэг
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium " +
    "whitespace-nowrap transition-colors cursor-pointer " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-fg hover:bg-primary/90",
        outline:
          "border border-line bg-surface text-ink hover:bg-surface-muted",
        ghost: "text-ink hover:bg-surface-muted",
        danger: "bg-danger text-ink-inverse hover:bg-danger/90",
      },
      size: {
        sm: "h-8 px-3 text-xs [&>svg]:size-3.5",
        md: "h-9 px-4 text-sm [&>svg]:size-4",
        lg: "h-11 px-6 text-base [&>svg]:size-5",
        icon: "size-9 [&>svg]:size-4",
        // sm товчтой ижил өндөр — жагсаалт, картын булан дахь жижиг товчинд.
        "icon-sm": "size-8 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /**
     * true бол <button> гаргахын оронд хүүхэд элемент рүү
     * классуудаа дамжуулна. Жишээ нь товч шиг харагдах холбоос:
     *   <Button asChild><a href="...">Нээх</a></Button>
     */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
export type { ButtonProps };
