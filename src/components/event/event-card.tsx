import type * as React from "react";
import { Video } from "lucide-react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui";

import { EventBadge } from "./event-badge";
import { EVENT_META, type EventType } from "./event-meta";

/**
 * Илрүүлсэн объектын хүрээ. Зургийн хэмжээнээс үл хамаарахын тулд
 * 0-1 харьцаагаар: { x: 0.5, y: 0.5, w: 0.1, h: 0.2 } → зургийн төвөөс
 * баруун, доош 10% өргөн, 20% өндөр хүрээ.
 */
type DetectionBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Хүрээний дээр гарах жижиг шошго: "хүн", "92%" гэх мэт. */
  label?: React.ReactNode;
};

type EventCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Үзэгдэл илэрсэн агшны зураг. */
  image: string;
  imageAlt?: string;
  /** Өгвөл EventBadge гарч, title-ыг EVENT_META-аас авна. */
  type?: EventType;
  /** type өгөөгүй эсвэл өөр гарчиг хэрэгтэй үед. */
  title?: React.ReactNode;
  cameraId?: React.ReactNode;
  cameraName?: React.ReactNode;
  /** Зургийн баруун доод буланд: "23:14:08" гэх мэт — форматыг дуудагч шийднэ. */
  time?: React.ReactNode;
  boxes?: readonly DetectionBox[];
  /** Хяналтын бүсийн олон өнцөгт, 0-1 харьцаагаар: [[x, y], ...]. */
  region?: readonly (readonly [number, number])[];
  tags?: readonly React.ReactNode[];
  /** Баруун дээд буланд: ⋮ товчтой DropdownMenu. */
  menu?: React.ReactNode;
  selected?: boolean;
};

const pct = (n: number) => `${n * 100}%`;

/**
 * Үзэгдлийн жагсаалтын карт: агшин зураг, илрүүлэлтийн хүрээ, камер, цаг.
 *
 *   <EventCard
 *     type="intrusion"
 *     image={event.snapshotUrl}
 *     cameraId="cam-narnii-zam"
 *     time="23:14:08"
 *     boxes={[{ x: 0.6, y: 0.52, w: 0.05, h: 0.11, label: "хүн" }]}
 *     region={[[0.47, 0.18], [0.56, 0.18], [0.8, 0.62], [0.7, 0.66]]}
 *     tags={["Хориотой бүс"]}
 *     menu={<DropdownMenu>…</DropdownMenu>}
 *     onClick={() => open(event.id)}
 *   />
 */
export function EventCard({
  image,
  imageAlt = "",
  type,
  title,
  cameraId,
  cameraName,
  time,
  boxes = [],
  region,
  tags = [],
  menu,
  selected,
  className,
  onClick,
  ...props
}: EventCardProps) {
  const heading = title ?? (type ? EVENT_META[type].title : null);
  const camera = [cameraId, cameraName].filter((part) => part != null && part !== "");

  return (
    <article
      data-slot="event-card"
      data-selected={selected || undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors",
        onClick && "cursor-pointer hover:border-ink-muted",
        selected && "border-primary ring-1 ring-primary hover:border-primary",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-video overflow-hidden bg-overlay">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          draggable={false}
          className="size-full object-cover"
        />

        {region && region.length > 2 && (
          <svg
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            <polygon
              points={region.map(([x, y]) => `${x},${y}`).join(" ")}
              vectorEffect="non-scaling-stroke"
              strokeWidth={1.5}
              className="fill-detection/10 stroke-detection"
            />
          </svg>
        )}

        {boxes.map((box, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute border-2 border-detection"
            style={{ left: pct(box.x), top: pct(box.y), width: pct(box.w), height: pct(box.h) }}
          >
            {box.label != null && (
              <span className="absolute bottom-full -left-0.5 bg-detection px-1 text-[10px] leading-4 font-medium whitespace-nowrap text-detection-fg">
                {box.label}
              </span>
            )}
          </div>
        ))}

        {time != null && (
          <span className="absolute right-2 bottom-2 rounded bg-overlay/75 px-1.5 py-0.5 font-mono text-xs text-overlay-fg">
            {time}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {camera.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Video className="size-3.5 shrink-0" />
                <span className="truncate">
                  {camera.map((part, i) => (
                    <span key={i}>
                      {i > 0 && " · "}
                      {part}
                    </span>
                  ))}
                </span>
              </div>
            )}
            {/* Монгол гарчиг урт — нэг мөрөнд тасалбал нарийн картад уншигдахгүй. */}
            {heading && (
              <div className="mt-0.5 line-clamp-2 leading-snug font-semibold text-ink">{heading}</div>
            )}
          </div>
          {/* Цэс дээр дарахад картын onClick ажиллахгүй. */}
          {menu && (
            <div className="-mt-1 -mr-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              {menu}
            </div>
          )}
        </div>

        {(type || tags.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {type && <EventBadge type={type} />}
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export type { DetectionBox, EventCardProps };
