import {
  Flame,
  Footprints,
  PersonStanding,
  ShieldAlert,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * AIVA analyzer-ийн илрүүлдэг үзэгдлүүд. Нэрс нь AIVA-ийн Prisma
 * schema-ийн `EventTarget` enum-тай яг ижил — backend-ээс ирсэн
 * утгыг хөрвүүлэлгүй шууд дамжуулна.
 *
 * AIVA-д counting, level, round, led, ocr гэж бас бий, гэхдээ
 * тэдгээр нь үйлдвэрийн хэмжүүр уншдаг — гудамжны камерт хамаагүй.
 * Хэрэг гарвал энд нэмэхэд л хангалттай.
 */
export type EventType =
  | "fire"
  | "violence"
  | "intrusion"
  | "loitering"
  | "falldown"
  | "crowd";

/** Хэр яаралтай вэ — өнгийг үүгээр сонгоно. */
export type EventTone = "danger" | "warning" | "info";

type EventMeta = {
  /** Badge-д гарах богино нэр. */
  label: string;
  /** Дохионы гарчиг. */
  title: string;
  icon: LucideIcon;
  tone: EventTone;
};

export const EVENT_META: Record<EventType, EventMeta> = {
  fire: { label: "Гал", title: "Гал илэрлээ", icon: Flame, tone: "danger" },
  violence: {
    label: "Хүчирхийлэл",
    title: "Хүчирхийлэл илэрлээ",
    icon: Swords,
    tone: "danger",
  },
  intrusion: {
    label: "Нэвтрэлт",
    title: "Хориотой бүсэд нэвтэрлээ",
    icon: ShieldAlert,
    tone: "warning",
  },
  loitering: {
    label: "Эргэлдэлт",
    title: "Сэжигтэй эргэлдэж байна",
    icon: Footprints,
    tone: "warning",
  },
  falldown: {
    label: "Унасан",
    title: "Хүн унасан",
    icon: PersonStanding,
    tone: "warning",
  },
  crowd: { label: "Бөөгнөрөл", title: "Олон хүн цугларлаа", icon: Users, tone: "info" },
};
