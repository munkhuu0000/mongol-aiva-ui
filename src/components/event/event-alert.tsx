import * as React from "react";

import { cn } from "../../lib/utils";

import { EVENT_META, type EventTone, type EventType } from "./event-meta";

type EventAlertProps = Omit<React.ComponentProps<"div">, "title"> & {
  type: EventType;
  /** Хаана илэрсэн. */
  cameraName: React.ReactNode;
  cameraId?: React.ReactNode;
  /** "2 минутын өмнө", "14:32" гэх мэт — форматыг дуудагч шийднэ. */
  time?: React.ReactNode;
  /** Баруун талын товч: <Button variant="danger" size="sm">Шалгах</Button> */
  action?: React.ReactNode;
};

// Tailwind эх кодоос классыг бүтэн мөрөөр нь хайдаг тул
// `bg-${tone}` гэж угсарч болохгүй — хүснэгтээр бичнэ.
const TONE_CLASSES: Record<EventTone, { root: string; icon: string; title: string }> = {
  danger: {
    root: "border-danger/30 bg-danger-soft",
    icon: "bg-danger",
    title: "text-danger",
  },
  warning: {
    root: "border-warning/30 bg-warning-soft",
    icon: "bg-warning",
    title: "text-warning",
  },
  info: {
    root: "border-info/30 bg-info-soft",
    icon: "bg-info",
    title: "text-info",
  },
};

/**
 * Analyzer-ийн илрүүлсэн үзэгдлийн мэдэгдэл.
 *
 *   <EventAlert
 *     type="fire"
 *     cameraName="Баянзүрх товчоо"
 *     cameraId="cam-bayanzurkh"
 *     time="2 минутын өмнө"
 *     action={<Button variant="danger" size="sm">Шалгах</Button>}
 *   />
 */
export function EventAlert({
  type,
  cameraName,
  cameraId,
  time,
  action,
  className,
  ...props
}: EventAlertProps) {
  const { title, icon: Icon, tone } = EVENT_META[type];
  const classes = TONE_CLASSES[tone];
  const details = [cameraName, cameraId, time].filter(
    (part) => part != null && part !== "",
  );

  return (
    <div
      data-slot="event-alert"
      role="alert"
      className={cn("flex items-center gap-3 rounded-lg border p-4", classes.root, className)}
      {...props}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-ink-inverse",
          classes.icon,
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className={cn("font-semibold", classes.title)}>{title}</div>
        <div className="truncate text-sm text-ink-muted">
          {details.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && " · "}
              {part}
            </React.Fragment>
          ))}
        </div>
      </div>

      {action}
    </div>
  );
}

export type { EventAlertProps };
