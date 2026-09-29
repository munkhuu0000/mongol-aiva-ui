import type * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

type SelectOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type SelectProps<T extends string> = Omit<
  React.ComponentProps<typeof SelectPrimitive.Trigger>,
  "value" | "defaultValue" | "onChange" | "children"
> & {
  options: readonly SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Юу ч сонгоогүй үед харагдана. */
  placeholder?: React.ReactNode;
  /** <form> дотор илгээгдэх нэр. */
  name?: string;
  required?: boolean;
};

/**
 * Жагсаалтаас нэгийг сонгох унадаг цэс.
 *
 *   <Select
 *     options={[{ value: "cam-1", label: "Сүхбаатарын талбай" }, ...]}
 *     value={cameraId}
 *     onChange={setCameraId}
 *     placeholder="Камер сонгох"
 *   />
 *
 * SegmentedControl-той ижил options / value / onChange авна — сонголт
 * олширвол нэгийг нөгөөгөөр шууд сольж болно. Хоосон мөр ("") value
 * болгож болохгүй — Radix үүнийг "сонгоогүй" гэж ойлгодог.
 */
export function Select<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  name,
  required,
  disabled,
  className,
  ...props
}: SelectProps<T>) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onChange?.(next as T)}
      name={name}
      required={required}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        data-slot="select"
        className={cn(
          "flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md " +
            "border border-line bg-surface px-3 text-sm whitespace-nowrap text-ink " +
            "data-placeholder:text-ink-muted " +
            "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary " +
            "disabled:cursor-not-allowed disabled:opacity-50 " +
            "aria-invalid:border-danger " +
            "[&>span]:truncate",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-4 shrink-0 text-ink-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot="select-content"
          position="popper"
          sideOffset={4}
          className={
            "z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) " +
            "overflow-hidden rounded-md border border-line bg-surface text-ink shadow-md"
          }
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={
                  "relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm " +
                  "outline-none select-none data-highlighted:bg-surface-muted " +
                  "data-disabled:pointer-events-none data-disabled:opacity-50"
                }
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                  <Check className="size-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export type { SelectOption, SelectProps };
