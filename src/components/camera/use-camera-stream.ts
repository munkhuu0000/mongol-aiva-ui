import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

import { connectWhep, type WhepSession } from "../../lib/whep";

/** Аль тээврээр видео ирж байгаа. */
export type StreamTransport = "connecting" | "webrtc" | "hls";

/**
 * MediaMTX (VSS)-ийн хаягууд. Төсөл бүрт порт өөр тул сан дотор
 * хатуу бичээгүй:
 *
 *   UbCam      whepBase: "http://192.168.1.27:7889", hlsBase: "http://192.168.1.27:7888"
 *   AIVA vss   whepBase: "https://192.168.1.27:9889", hlsBase: "https://192.168.1.27:9888"
 */
export type StreamEndpoints = {
  /** WebRTC (~0.3 сек саатал). Өгвөл эхлээд үүгээр оролдоно. */
  whepBase?: string;
  /** HLS (3-6 сек). WebRTC бүтэхгүй эсвэл whepBase өгөөгүй үед. */
  hlsBase?: string;
};

/**
 * Камерын шууд урсгалыг <video> элементэд холбоно. Эхлээд WebRTC,
 * бүтэхгүй бол HLS руу автоматаар шилжинэ.
 *
 *   const { videoRef, transport, error } = useCameraStream(camera.id, endpoints);
 *   <video ref={videoRef} autoPlay muted playsInline />
 *
 * CameraPlayer-ийн загвар тохирохгүй үед (олон камерын тор гэх мэт)
 * энэ hook-ийг шууд ашиглана.
 */
export function useCameraStream(
  streamId: string | null | undefined,
  { whepBase, hlsBase }: StreamEndpoints,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [transport, setTransport] = useState<StreamTransport>("connecting");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamId) return;

    setError(null);
    setTransport("connecting");

    // Энэ эффект дуусахад цэвэрлэх зүйлс. WHEP асинхрон тул
    // хэрэглэгч өөр камер дарахад "хуучин" холболт хожуу ирж
    // шинийг нь дарж болзошгүй — cancelled туг үүнээс хамгаална.
    let cancelled = false;
    let whep: WhepSession | null = null;
    let hls: Hls | null = null;

    const startHls = (reason?: string) => {
      if (cancelled) return;

      if (!hlsBase) {
        setError(reason ?? "Урсгалын хаяг өгөөгүй (whepBase / hlsBase)");
        return;
      }
      if (reason) console.warn("[useCameraStream] HLS руу шилжлээ:", reason);

      const url = `${hlsBase}/${streamId}/index.m3u8`;

      // ЭХЛЭЭД hls.js. Эсрэгээр нь бичиж болохгүй: Chrome нь
      // canPlayType("application/vnd.apple.mpegurl") дээр "maybe"
      // буцаадаг хэрнээ HLS-ийг үнэндээ дэмждэггүй.
      if (Hls.isSupported()) {
        hls = new Hls({ lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) {
            console.error("[useCameraStream] fatal HLS", data.type, data.details);
            setError(`Урсгал ачаалагдсангүй: ${data.details}`);
          }
        });
        setTransport("hls");
        return;
      }

      // Safari / iOS — HLS-ийг төрөлхөөсөө дэмждэг.
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        setTransport("hls");
        return;
      }

      setError("Энэ хөтөч HLS дэмжихгүй байна");
    };

    if (!whepBase) {
      startHls();
    } else {
      connectWhep(`${whepBase}/${streamId}/whep`, {
        onTrack: (stream) => {
          if (cancelled) return;
          video.srcObject = stream;
          setTransport("webrtc");
        },
        onError: (message) => {
          // ICE холболт замын дунд тасарвал HLS руу буцна.
          if (!cancelled) startHls(message);
        },
      })
        .then((session) => {
          if (cancelled) {
            session.close();
            return;
          }
          whep = session;
        })
        .catch((e: unknown) => {
          // WHEP огт эхэлж чадсангүй — сүлжээ UDP хаасан байж магадгүй.
          startHls(e instanceof Error ? e.message : String(e));
        });
    }

    return () => {
      cancelled = true;
      whep?.close();
      hls?.destroy();
      video.srcObject = null;
      video.removeAttribute("src");
    };
  }, [streamId, whepBase, hlsBase]);

  return { videoRef, transport, error };
}
