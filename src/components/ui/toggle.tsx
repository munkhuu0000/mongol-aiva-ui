import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

const toggleVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-medium " +
    "whitespace-nowrap transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 " +
    // Дарагдсан үед SegmentedControl-ийн идэвхтэй сонголттой ижил харагдана.
    "data-[state=on]:bg-primary data-[state=on]:text-primary-fg",
  {
    variants: {
      variant: {
        default: "text-ink data-[state=off]:hover:bg-surface-muted",
        outline:
          "border border-line bg-surface text-ink data-[state=off]:hover:bg-surface-muted " +
          "data-[state=on]:border-primary",
      },
      size: {
        sm: "h-8 px-3 text-xs [&>svg]:size-3.5",
        md: "h-9 px-4 text-sm [&>svg]:size-4",
        lg: "h-11 px-6 text-base [&>svg]:size-5",
        icon: "size-9 [&>svg]:size-4",
        "icon-sm": "size-8 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;

/**
 * Дарахад асч, дахин дарахад унтардаг товч.
 *
 *   <Toggle pressed={muted} onPressedChange={setMuted} aria-label="Дуу хаах">
 *     <VolumeX />
 *   </Toggle>
 *
 * Хяналтгүй хэрэглэж болно: <Toggle defaultPressed>Бичлэг</Toggle>
 */
export function Toggle({ className, variant, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { toggleVariants };
export type { ToggleProps };
