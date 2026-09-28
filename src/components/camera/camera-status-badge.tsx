import type { CameraStatus } from "../../types";
import { Badge, type BadgeProps } from "../ui";

const STATUS_LABEL: Record<CameraStatus, string> = {
  online: "Онлайн",
  offline: "Офлайн",
};

type CameraStatusBadgeProps = Omit<BadgeProps, "variant" | "dot"> & {
  status: CameraStatus;
};

/** <CameraStatusBadge status={camera.status} /> → ● Онлайн */
export function CameraStatusBadge({ status, children, ...props }: CameraStatusBadgeProps) {
  return (
    <Badge variant={status} dot {...props}>
      {children ?? STATUS_LABEL[status]}
    </Badge>
  );
}

export type { CameraStatusBadgeProps };
