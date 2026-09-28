import type * as React from "react";

import { cn } from "../../lib/utils";

type SegmentedOption<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type SegmentedControlProps<T extends string> = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Хэд хэдэн сонголтоос яг нэгийг сонгох товчны бүлэг.
 *
 *   <SegmentedControl
 *     options={[{ value: "map", label: "Газрын зураг" }, { value: "satellite", label: "Хиймэл дагуул" }]}
 *     value={layer}
 *     onChange={setLayer}
 *   />
 *
 * T нь value-ийн төрлөөс автоматаар тогтоно — onChange-д "map" | "satellite"
 * гэж ирэх тул string-ийг дахин хөрвүүлэх шаардлагагүй.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      data-slot="segmented-control"
      role="group"
      className={cn(
        "inline-flex w-fit overflow-hidden rounded-lg bg-surface shadow-md ring-1 ring-line",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer px-3.5 py-2 text-[13px] font-semibold transition-colors " +
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
              active
                ? "bg-primary text-primary-fg"
                : "text-ink hover:bg-surface-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export type { SegmentedControlProps, SegmentedOption };
