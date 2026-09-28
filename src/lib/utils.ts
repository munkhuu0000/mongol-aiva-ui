import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind классуудыг аюулгүй нийлүүлнэ.
 *
 *   clsx    — нөхцөлт класс: cn("p-2", isActive && "bg-primary")
 *   twMerge — зөрчилдөөнийг шийднэ: cn("p-2", "p-4") → "p-4"
 *
 * twMerge-гүй бол хоёр класс хоёулаа CSS-д орж, аль нь ялахыг
 * таах болно. Компонентын анхдагч классыг гаднаас дарахад
 * энэ нь заавал хэрэгтэй.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * theme.css-ийн өнгийг JS-ээс уншина — Tailwind класс хэрэглэж
 * чаддаггүй газарт (OpenLayers-ийн canvas дээр зурах маркер гэх мэт).
 *
 *   themeColor("online") → "#22c55e"
 *
 * styles.css (эсвэл theme.css) ачаалагдаагүй бол "" буцаана.
 */
export function themeColor(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();
}
