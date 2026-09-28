import type * as React from "react";
import { Pencil, Settings } from "lucide-react";

import { Button, type ButtonProps } from "./button";

type IconButtonProps = Omit<ButtonProps, "asChild" | "children" | "size"> & {
  /** Анхдагч нь "icon-sm" (32px). Том хэрэгтэй бол "icon" (36px). */
  size?: "icon-sm" | "icon";
};

/**
 * Дүрс л агуулсан товчинд бичиг байхгүй тул дэлгэц уншигч болон
 * хулганаар заахад гарах тайлбарыг aria-label-аас авна.
 */
function IconButton({
  icon,
  label,
  variant = "outline",
  size = "icon-sm",
  "aria-label": ariaLabel = label,
  title,
  ...props
}: IconButtonProps & { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      {...props}
    >
      {icon}
    </Button>
  );
}

/**
 * Араатай жижиг товч — тохиргоо нээнэ.
 *
 *   <SettingsButton onClick={openSettings} />
 *   <SettingsButton variant="ghost" aria-label="Камерын тохиргоо" />
 */
export function SettingsButton(props: IconButtonProps) {
  return <IconButton icon={<Settings />} label="Тохиргоо" {...props} />;
}

/**
 * Харандаатай жижиг товч — засварлах.
 *
 *   <EditButton onClick={() => edit(camera.id)} />
 */
export function EditButton(props: IconButtonProps) {
  return <IconButton icon={<Pencil />} label="Засах" {...props} />;
}

export type { IconButtonProps };
