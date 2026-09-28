import { Badge, type BadgeProps } from "../ui";

import { EVENT_META, type EventType } from "./event-meta";

type EventBadgeProps = Omit<BadgeProps, "variant" | "dot"> & {
  type: EventType;
};

/**
 * Үзэгдлийн төрлийг дүрс, өнгөтэй нь харуулна. Өнгө нь яаралтай
 * байдлаас хамаарна: гал → улаан, нэвтрэлт → шар.
 *
 *   <EventBadge type="fire" />
 */
export function EventBadge({ type, children, ...props }: EventBadgeProps) {
  const { label, icon: Icon, tone } = EVENT_META[type];

  return (
    <Badge variant={tone} {...props}>
      <Icon className="size-3" />
      {children ?? label}
    </Badge>
  );
}

export type { EventBadgeProps };
