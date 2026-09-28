import type * as React from "react";
import { CircleAlert, Video } from "lucide-react";

import { cn } from "../../lib/utils";
import type { Camera } from "../../types";
import { Alert, EmptyState, Spinner } from "../ui";

import {
  useCameraStream,
  type StreamEndpoints,
  type StreamTransport,
} from "./use-camera-stream";

const TRANSPORT_LABEL: Record<StreamTransport, string> = {
  connecting: "холбогдож байна",
  webrtc: "WebRTC",
  hls: "HLS",
};

type CameraPlayerProps = React.ComponentProps<"div"> &
  StreamEndpoints & {
    /** null бол "камер сонгоогүй" хоосон төлөв гарна. */
    camera: Camera | null;
    /** Камер сонгоогүй үеийн тайлбар. */
    emptyText?: React.ReactNode;
  };

/**
 * Камерын шууд видео: гарчиг, видео, алдаа, координат.
 * WebRTC → HLS шилжилтийг өөрөө хийнэ.
 *
 *   <CameraPlayer
 *     camera={selected}
 *     whepBase="http://192.168.1.27:7889"
 *     hlsBase="http://192.168.1.27:7888"
 *   />
 */
export function CameraPlayer({
  camera,
  whepBase,
  hlsBase,
  emptyText = "Газрын зураг эсвэл жагсаалтаас камер сонгоно уу",
  className,
  ...props
}: CameraPlayerProps) {
  const { videoRef, transport, error } = useCameraStream(camera?.id, {
    whepBase,
    hlsBase,
  });

  return (
    <div
      data-slot="camera-player"
      className={cn("flex h-full flex-col bg-surface", className)}
      {...props}
    >
      {camera ? (
        <>
          <div className="flex flex-col gap-0.5 border-b border-line px-4 py-3">
            <span className="font-semibold text-ink">{camera.name}</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              {camera.id} ·
              {transport === "connecting" && !error && <Spinner className="size-3" />}
              {TRANSPORT_LABEL[transport]}
            </span>
          </div>

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls
            className="aspect-video w-full bg-black"
          />

          {error && (
            <Alert variant="danger" icon={<CircleAlert />} className="rounded-none">
              {error}
            </Alert>
          )}

          <div className="px-4 py-2 font-mono text-xs text-ink-muted">
            {camera.lat.toFixed(4)}, {camera.lon.toFixed(4)}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Video />}
          title="Камер сонгоогүй байна"
          description={emptyText}
        />
      )}
    </div>
  );
}

export type { CameraPlayerProps };
