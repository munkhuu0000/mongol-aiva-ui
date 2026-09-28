/**
 * WHEP (WebRTC-HTTP Egress Protocol) клиент.
 *
 * MediaMTX-аас WebRTC-ээр видео хүлээж авна. HLS-ийн 3-6 секундын
 * оронд 0.2-0.5 секундын саатал өгнө.
 *
 * Холболтын дараалал:
 *   1. RTCPeerConnection үүсгэж "зөвхөн хүлээж авна" гэж тохируулна
 *   2. SDP offer үүсгэнэ
 *   3. ICE хайлт дуустал хүлээнэ (non-trickle — доорх тайлбарыг үз)
 *   4. offer-ийг POST хийж answer авна
 *   5. answer-ийг тохируулна → видео урсана
 */

export type WhepSession = {
  /** Холболтыг таслаж, серверийн сессийг цэвэрлэнэ. */
  close: () => void;
};

export type WhepHandlers = {
  onTrack: (stream: MediaStream) => void;
  onStateChange?: (state: RTCIceConnectionState) => void;
  onError?: (message: string) => void;
};

/** ICE хайлтыг хэдэн миллисекунд хүлээхээ. Дараа нь байгаагаараа үргэлжилнэ. */
const ICE_GATHER_TIMEOUT_MS = 3000;

export async function connectWhep(
  url: string,
  handlers: WhepHandlers,
): Promise<WhepSession> {
  const pc = new RTCPeerConnection({ iceServers: [] });
  let sessionUrl: string | null = null;
  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;

    // Серверийн сессийг чөлөөлнө. Амжилтгүй болсон ч хамаагүй —
    // MediaMTX ашиглагдаагүй сессийг өөрөө хугацаагаар нь устгадаг.
    if (sessionUrl) {
      fetch(sessionUrl, { method: "DELETE" }).catch(() => {});
    }
    pc.close();
  };

  try {
    // Зөвхөн хүлээж авна — камер, микрофон асаахгүй.
    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    const stream = new MediaStream();
    pc.ontrack = (event) => {
      stream.addTrack(event.track);
      handlers.onTrack(stream);
    };

    pc.oniceconnectionstatechange = () => {
      handlers.onStateChange?.(pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        handlers.onError?.("ICE холболт амжилтгүй");
      }
    };

    await pc.setLocalDescription(await pc.createOffer());
    await waitForIceGathering(pc);

    // non-trickle ICE: бүх нэр дэвшигчийг offer дотор нэг дор илгээнэ.
    // Trickle хийвэл нэмэлт нэр дэвшигчийг Location хаяг руу PATCH хийх
    // хэрэгтэй болдог. MediaMTX-ийн preflight хариу нь Location-ыг
    // Expose-Headers-т жагсаадаггүй тул тэр замыг найдваргүй гэж үзсэн.
    // LAN дээр нэр дэвшигч шууд олддог учир non-trickle нь хурдны
    // хувьд ялгаагүй.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/sdp" },
      body: pc.localDescription!.sdp,
    });

    if (response.status !== 201) {
      const detail = (await response.text()).slice(0, 120);
      throw new Error(`WHEP ${response.status}: ${detail || "тодорхойгүй"}`);
    }

    const location = response.headers.get("Location");
    if (location) sessionUrl = new URL(location, url).href;

    // Хүсэлт явж байх зуур бүрэлдэхүүн салсан байж болно.
    if (closed) {
      if (sessionUrl) fetch(sessionUrl, { method: "DELETE" }).catch(() => {});
      return { close };
    }

    await pc.setRemoteDescription({
      type: "answer",
      sdp: await response.text(),
    });
  } catch (error) {
    close();
    throw error;
  }

  return { close };
}

function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      pc.removeEventListener("icegatheringstatechange", onChange);
      clearTimeout(timer);
      resolve();
    };
    const onChange = () => {
      if (pc.iceGatheringState === "complete") finish();
    };
    const timer = setTimeout(finish, ICE_GATHER_TIMEOUT_MS);
    pc.addEventListener("icegatheringstatechange", onChange);
  });
}
