import { useState } from "react";
import type * as React from "react";
import { ChevronDown } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

import { Button } from "./button";

type FilterOption<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type FilterChipProps<T extends string> = Omit<
  React.ComponentProps<"button">,
  "value" | "onChange" | "children"
> & {
  /** Товчны нэр: "Камер", "Үзэгдлийн төрөл". */
  label: React.ReactNode;
  icon?: React.ReactNode;
  options: readonly FilterOption<T>[];
  /** Сонгосон утгууд. Хоосон бол шүүлтүүр идэвхгүй. */
  value: readonly T[];
  /** "Хэрэглэх" дарахад л дуудагдана — чагт бүрт биш. */
  onChange: (value: T[]) => void;
  applyLabel?: React.ReactNode;
  clearLabel?: React.ReactNode;
};

/**
 * Дугуй шүүлтүүрийн товч. Дарахад чагттай жагсаалт гарч, "Хэрэглэх"
 * дарахад сонголт хадгалагдана. Хаавал (Esc, гадна дарах) өөрчлөлт
 * хаягдана — олон камер дээр хайлтыг чагт бүрт дахин ажиллуулахгүйн тулд.
 *
 *   <FilterChip
 *     label="Камер"
 *     options={cameras.map((c) => ({ value: c.id, label: c.name }))}
 *     value={cameraIds}
 *     onChange={setCameraIds}
 *   />
 */
export function FilterChip<T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
  applyLabel = "Хэрэглэх",
  clearLabel = "Цэвэрлэх",
  className,
  ...props
}: FilterChipProps<T>) {
  const [open, setOpen] = useState(false);
  // Нээлттэй үеийн түр сонголт — "Хэрэглэх" дартал value-д орохгүй.
  const [draft, setDraft] = useState<T[]>([]);
  const active = value.length > 0;

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft([...value]);
    setOpen(next);
  };

  const toggle = (option: T) =>
    setDraft((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option],
    );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="filter-chip"
          data-active={active || undefined}
          className={cn(
            "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 " +
              "text-sm font-medium whitespace-nowrap text-ink transition-colors " +
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
              "disabled:pointer-events-none disabled:opacity-50 " +
              "[&>svg]:size-4 [&>svg]:shrink-0",
            active
              ? "border-primary bg-primary/10"
              : "border-line bg-surface hover:bg-surface-muted",
            className,
          )}
          {...props}
        >
          {icon}
          {label}
          {active && (
            <span className="rounded-full bg-primary px-1.5 text-[11px] leading-4 text-primary-fg">
              {value.length}
            </span>
          )}
          <ChevronDown className="text-ink-muted" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="filter-chip-content"
          align="start"
          sideOffset={6}
          className="z-50 flex w-64 flex-col rounded-md border border-line bg-surface text-ink shadow-md"
        >
          <div className="max-h-64 overflow-y-auto p-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-surface-muted"
              >
                <input
                  type="checkbox"
                  checked={draft.includes(option.value)}
                  onChange={() => toggle(option.value)}
                  className="size-4 shrink-0 cursor-pointer accent-primary"
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-line p-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={draft.length === 0}
              onClick={() => setDraft([])}
            >
              {clearLabel}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              {applyLabel}
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export type { FilterChipProps, FilterOption };
