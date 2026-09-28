// Сангийн нүүр хаалга — `import { ... } from "mongol-aiva-ui"` энд ирнэ.
// Энд экспортлоогүй зүйл импортлосон төсөлд харагдахгүй.

// Vite үүнийг dist/styles.css болгож тусад нь гаргана — index.js дотор
// импорт үлдэхгүй, тиймээс хэрэглэгч "mongol-aiva-ui/styles.css"-ийг
// өөрөө импортлоно.
import "./styles.css";

export * from "./components/ui";
export * from "./components/layout";
export * from "./components/camera";
export * from "./components/event";

export { cn, themeColor } from "./lib/utils";
export { connectWhep, type WhepHandlers, type WhepSession } from "./lib/whep";
export type { Camera, CameraStatus } from "./types";
