import { useEffect, useState } from "react";
import type * as React from "react";
import {
  Bell,
  ChevronDown,
  CircleAlert,
  Download,
  EllipsisVertical,
  ImageDown,
  Info,
  Moon,
  Pencil,
  Pin,
  Plus,
  Route,
  ScanSearch,
  Search,
  Settings,
  Sun,
  Trash,
  TriangleAlert,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

// Сангийн нүүр хаалгаар (src/index.ts) импортлоно — ингэснээр
// экспортоос дутуу зүйл байвал энд шууд алдаа гарна.
import {
  Alert,
  Badge,
  Button,
  CameraPlayer,
  CameraStatusBadge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EditButton,
  EmptyState,
  EVENT_META,
  EventAlert,
  EventBadge,
  EventCard,
  FilterChip,
  Footer,
  Header,
  Input,
  SegmentedControl,
  Select,
  SettingsButton,
  Spinner,
  Toggle,
  type Camera,
  type DetectionBox,
  type EventType,
} from "../src";

// Жишээ агшин зургууд — demo.mp4-ийн frame-ууд.
import snapCrowd from "./assets/snap-crowd.jpg";
import snapIntrusion from "./assets/snap-intrusion.jpg";
import snapLoitering from "./assets/snap-loitering.jpg";
import snapMotion from "./assets/snap-motion.jpg";
import snapVehicle from "./assets/snap-vehicle.jpg";

// Үзүүлэн нийтийн сайт дээр байрладаг тул дотоод VSS руу холбогдох
// боломжгүй — оронд нь жишээ бичлэг (сток, чөлөөт лиценз) тоглуулна.
import demoClip from "./assets/demo.mp4";

// UbCam/data/cameras.json + офлайн төлөв харуулах жишээ нэг.
const CAMERAS: Camera[] = [
  { id: "cam-sukhbaatar", name: "Сүхбаатарын талбай", lat: 47.9186, lon: 106.9176, status: "online" },
  { id: "cam-narnii-zam", name: "Нарны зам уулзвар", lat: 47.9135, lon: 106.906, status: "online" },
  { id: "cam-bayanzurkh", name: "Баянзүрх товчоо", lat: 47.918, lon: 106.96, status: "online" },
  { id: "cam-demo-offline", name: "Жишээ (офлайн)", lat: 47.92, lon: 106.93, status: "offline" },
];

const EVENT_TYPES = Object.keys(EVENT_META) as EventType[];

const LAYERS = [
  { value: "map", label: "Газрын зураг" },
  { value: "satellite", label: "Хиймэл дагуул" },
] as const;

// Офлайн камер сонгогдохгүй — Select-ийн disabled сонголтыг харуулна.
const CAMERA_OPTIONS = CAMERAS.map((camera) => ({
  value: camera.id,
  label: camera.name,
  disabled: camera.status === "offline",
}));

const RANGES = [
  { value: "15m", label: "Сүүлийн 15 минут" },
  { value: "1h", label: "Сүүлийн 1 цаг" },
  { value: "24h", label: "Сүүлийн 24 цаг" },
] as const;

type DemoEvent = {
  id: string;
  type?: EventType;
  title?: string;
  subject: "people" | "vehicles";
  image: string;
  cameraId: string;
  /** "ЦЦ:ММ:СС" — мөрөөр нь эрэмбэлж болно. */
  at: string;
  boxes: DetectionBox[];
  region?: [number, number][];
  tags: string[];
};

// Хүрээнүүдийг зураг бүр дээрх бодит хүн, машин дээр байрлуулсан.
const EVENTS: DemoEvent[] = [
  {
    id: "e1",
    type: "crowd",
    subject: "people",
    image: snapCrowd,
    cameraId: "cam-sukhbaatar",
    at: "23:14:08",
    boxes: [{ x: 0.48, y: 0.58, w: 0.27, h: 0.39, label: "23 хүн" }],
    tags: ["Талбай"],
  },
  {
    id: "e2",
    type: "intrusion",
    subject: "people",
    image: snapIntrusion,
    cameraId: "cam-narnii-zam",
    at: "23:12:41",
    region: [
      [0.4, 0.2],
      [0.5, 0.2],
      [0.68, 0.66],
      [0.52, 0.72],
    ],
    boxes: [{ x: 0.6, y: 0.52, w: 0.04, h: 0.1, label: "хүн" }],
    tags: ["Хориотой бүс"],
  },
  {
    id: "e3",
    type: "loitering",
    subject: "people",
    image: snapLoitering,
    cameraId: "cam-bayanzurkh",
    at: "23:09:55",
    boxes: [{ x: 0.185, y: 0.34, w: 0.12, h: 0.15, label: "4 мин" }],
    tags: ["Явган зам"],
  },
  {
    id: "e4",
    title: "Хөдөлгөөн илэрлээ",
    subject: "people",
    image: snapMotion,
    cameraId: "cam-sukhbaatar",
    at: "23:05:12",
    boxes: [{ x: 0.285, y: 0.29, w: 0.06, h: 0.15, label: "дугуй" }],
    tags: ["Гарц"],
  },
  {
    id: "e5",
    title: "Замд зогссон машин",
    subject: "vehicles",
    image: snapVehicle,
    cameraId: "cam-narnii-zam",
    at: "22:58:30",
    boxes: [{ x: 0.625, y: 0.63, w: 0.1, h: 0.15, label: "машин" }],
    tags: ["Зогсоол"],
  },
];

const SUBJECTS = [
  { value: "all", label: "Бүгд" },
  { value: "people", label: "Хүн" },
  { value: "vehicles", label: "Тээврийн хэрэгсэл" },
] as const;

/** Хяналтын дэлгэцийн горим: энгийн (шууд видео) ↔ үзэгдэл (analyzer-ийн илрүүлэлт). */
type Mode = "live" | "events";

const SORTS = [
  { value: "newest", label: "Шинэ нь эхэндээ" },
  { value: "oldest", label: "Хуучин нь эхэндээ" },
] as const;

const TYPE_OPTIONS = EVENT_TYPES.map((type) => ({ value: type, label: EVENT_META[type].label }));
const CAMERA_FILTER_OPTIONS = CAMERAS.map((camera) => ({ value: camera.id, label: camera.name }));

/** Хажуугийн цэс. Нийт компонентын тоо эндээс гарна. */
const NAV = [
  {
    id: "monitor",
    title: "Хяналтын дэлгэц",
    items: ["CameraPlayer", "EventCard", "FilterChip"],
  },
  {
    id: "button",
    title: "Товч",
    items: ["Button", "SettingsButton", "EditButton", "DropdownMenu", "Select", "Toggle"],
  },
  { id: "badge", title: "Badge", items: ["Badge", "CameraStatusBadge", "EventBadge"] },
  { id: "alert", title: "Мэдэгдэл", items: ["Alert", "EventAlert"] },
  { id: "card", title: "Card", items: ["Card"] },
  { id: "input", title: "Оролт", items: ["Input", "SegmentedControl"] },
  { id: "state", title: "Төлөв", items: ["Spinner", "EmptyState"] },
  { id: "layout", title: "Layout", items: ["Header", "Footer"] },
];
const TOTAL = NAV.reduce((sum, group) => sum + group.items.length, 0);

export function App() {
  const [mode, setMode] = useState<Mode>("live");
  const [selected, setSelected] = useState<Camera | null>(CAMERAS[0]);
  const [layer, setLayer] = useState<(typeof LAYERS)[number]["value"]>("map");
  const [cameraId, setCameraId] = useState<string>();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  // Бараан горим — <html class="dark">. Portal-оор зурагддаг цэсүүд
  // (DropdownMenu, Select, FilterChip) ч дагах ёстой тул html дээр.
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("showcase-theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("showcase-theme", dark ? "dark" : "light");
    } catch {
      // Хадгалах боломжгүй (хувийн цонх гэх мэт) — горим ажилласаар байна.
    }
  }, [dark]);

  // Үзэгдлийн дэлгэцийн шүүлтүүр
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]["value"]>("all");
  const [typeFilter, setTypeFilter] = useState<EventType[]>([]);
  const [cameraFilter, setCameraFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("newest");
  const [openEvent, setOpenEvent] = useState<string | null>("e2");
  const [chipDemo, setChipDemo] = useState<EventType[]>(["fire", "intrusion"]);

  const visibleEvents = EVENTS.filter(
    (event) =>
      (subject === "all" || event.subject === subject) &&
      (typeFilter.length === 0 || (event.type && typeFilter.includes(event.type))) &&
      (cameraFilter.length === 0 || cameraFilter.includes(event.cameraId)),
  ).sort((a, b) => (sort === "newest" ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at)));

  const eventCount = (cameraId: string) => EVENTS.filter((e) => e.cameraId === cameraId).length;
  const onlineCount = CAMERAS.filter((c) => c.status === "online").length;

  // Үзэгдлээс тухайн камерын шууд видео руу шилжинэ.
  const openCamera = (cameraId: string) => {
    setSelected(CAMERAS.find((c) => c.id === cameraId) ?? null);
    setMode("live");
  };

  const modeOptions = [
    {
      value: "live",
      label: (
        // Утсан дээр зөвхөн дүрс — гарчигт зай үлдээнэ. Текст дэлгэц уншигчид хэвээр.
        <span className="flex items-center gap-1.5">
          <Video className="size-4" /> <span className="sr-only sm:not-sr-only">Энгийн</span>
        </span>
      ),
    },
    {
      value: "events",
      label: (
        <span className="flex items-center gap-1.5">
          <ScanSearch className="size-4" /> <span className="sr-only sm:not-sr-only">Үзэгдэл</span>
          <span className="rounded-full bg-danger px-1.5 text-[11px] leading-4 text-ink-inverse">
            {EVENTS.length}
          </span>
        </span>
      ),
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted text-ink">
      <Header
        className="sticky top-0 z-10"
        title="Mongol AIVA UI"
        subtitle={`${TOTAL} компонент`}
        actions={
          <>
            <Badge variant="outline">v0.1.0</Badge>
            <Toggle
              size="icon-sm"
              variant="outline"
              pressed={dark}
              onPressedChange={setDark}
              aria-label="Бараан горим"
              title="Бараан горим"
            >
              {dark ? <Moon /> : <Sun />}
            </Toggle>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-8">
        <aside className="sticky top-20 hidden w-44 shrink-0 self-start md:block">
          <nav className="flex flex-col gap-4 text-sm">
            {NAV.map((group) => (
              <div key={group.id}>
                <a href={`#${group.id}`} className="font-semibold hover:underline">
                  {group.title}
                </a>
                <ul className="mt-1 flex flex-col gap-0.5 border-l border-line pl-3 font-mono text-xs text-ink-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-14">
          {/* ─── Хяналтын дэлгэц ──────────────────────────────── */}
          <Section
            id="monitor"
            title="Хяналтын дэлгэц"
            description="Камерын шууд видео ба analyzer-ийн илрүүлсэн үзэгдлүүд нэг дэлгэцэнд. Дээд талын шилжүүлэгчээр Энгийн ↔ Үзэгдэл горим солино. Бүхэлдээ сангийн компонентуудаас угсрагдсан — баруун дээд буланд бараан горим асааж үзээрэй."
            imports={[
              "Header",
              "SegmentedControl",
              "CameraPlayer",
              "CameraStatusBadge",
              "EventCard",
              "FilterChip",
              "Select",
              "DropdownMenu",
            ]}
          >
            <Group title="Жишээ дэлгэц — Энгийн / Үзэгдэл">
              <Specimen
                wide
                bodyClassName="p-0"
                code={
                  'const [mode, setMode] = useState<"live" | "events">("live");\n\n' +
                  "<Header\n" +
                  '  title="Хяналт"\n' +
                  "  actions={\n" +
                  "    <SegmentedControl\n" +
                  '      options={[{ value: "live", label: "Энгийн" }, { value: "events", label: "Үзэгдэл" }]}\n' +
                  "      value={mode}\n" +
                  "      onChange={setMode}\n" +
                  "    />\n" +
                  "  }\n" +
                  "/>\n" +
                  '{mode === "live" ? (\n' +
                  '  <CameraPlayer camera={camera} whepBase="…" hlsBase="…" />\n' +
                  ") : (\n" +
                  "  <>\n" +
                  '    <FilterChip label="Үзэгдлийн төрөл" options={[…]} value={types} onChange={setTypes} />\n' +
                  "    {events.map((e) => <EventCard key={e.id} {...e} menu={<EventMenu />} />)}\n" +
                  "  </>\n" +
                  ")}"
                }
              >
                <div className="bg-surface-muted">
                  <Header
                    title="Хяналт"
                    subtitle={
                      mode === "live"
                        ? `${onlineCount} / ${CAMERAS.length} камер онлайн`
                        : `${visibleEvents.length} / ${EVENTS.length} үзэгдэл`
                    }
                    actions={
                      <>
                        <SegmentedControl
                          options={modeOptions}
                          value={mode}
                          onChange={setMode}
                          aria-label="Дэлгэцийн горим"
                        />
                        <SettingsButton variant="ghost" />
                      </>
                    }
                  />

                  {mode === "live" ? (
                    <div className="grid gap-4 p-4 md:grid-cols-[260px_1fr]">
                      <div className="flex flex-col gap-1">
                        {CAMERAS.map((camera) => {
                          const count = eventCount(camera.id);
                          return (
                            <button
                              key={camera.id}
                              type="button"
                              onClick={() => setSelected(camera)}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                                selected?.id === camera.id
                                  ? "bg-surface-accent"
                                  : "hover:bg-surface",
                              )}
                            >
                              <span className="min-w-0 flex-1 truncate">{camera.name}</span>
                              {count > 0 && (
                                <Badge variant="danger" title={`${count} үзэгдэл`}>
                                  {count}
                                </Badge>
                              )}
                              <CameraStatusBadge status={camera.status} />
                            </button>
                          );
                        })}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => setSelected(null)}
                        >
                          Сонголт цуцлах
                        </Button>
                      </div>

                      <Card className="min-h-72 overflow-hidden">
                        <CameraPlayer camera={selected} src={demoClip} />
                      </Card>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 p-4">
                      <SegmentedControl options={SUBJECTS} value={subject} onChange={setSubject} />
                      <div className="flex flex-wrap items-center gap-2">
                        <FilterChip
                          label="Үзэгдлийн төрөл"
                          options={TYPE_OPTIONS}
                          value={typeFilter}
                          onChange={setTypeFilter}
                        />
                        <FilterChip
                          label="Камер"
                          icon={<Video />}
                          options={CAMERA_FILTER_OPTIONS}
                          value={cameraFilter}
                          onChange={setCameraFilter}
                        />
                        {(typeFilter.length > 0 || cameraFilter.length > 0) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTypeFilter([]);
                              setCameraFilter([]);
                            }}
                          >
                            Бүгдийг цэвэрлэх
                          </Button>
                        )}
                        <Select
                          options={SORTS}
                          value={sort}
                          onChange={setSort}
                          aria-label="Эрэмбэ"
                          className="ml-auto h-8 w-44"
                        />
                      </div>

                      {visibleEvents.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
                          {visibleEvents.map((event) => (
                            <EventCard
                              key={event.id}
                              type={event.type}
                              title={event.title}
                              image={event.image}
                              cameraId={event.cameraId}
                              time={event.at}
                              boxes={event.boxes}
                              region={event.region}
                              tags={event.tags}
                              selected={openEvent === event.id}
                              onClick={() => setOpenEvent(event.id)}
                              menu={<EventMenu onOpenCamera={() => openCamera(event.cameraId)} />}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={<Search />}
                          title="Үзэгдэл олдсонгүй"
                          description="Шүүлтүүрээ өөрчилж үзнэ үү."
                          className="h-48"
                        />
                      )}
                    </div>
                  )}
                </div>
              </Specimen>
            </Group>

            <Group title="CameraPlayer — шууд урсгал эсвэл бичлэг">
              <Specimen
                wide
                code={
                  `// Шууд урсгал (MediaMTX / VSS) — эхлээд WebRTC, бүтэхгүй бол HLS\n` +
                  `<CameraPlayer camera={camera} whepBase="http://<vss-хост>:7889" hlsBase="http://<vss-хост>:7888" />\n\n` +
                  `// Бичлэг — mp4, webm. Энд үүгээр тоглож байна: шууд урсгал VSS-тэй сүлжээнд л ажиллана.\n` +
                  `<CameraPlayer camera={camera} src="/clips/cam-1.mp4" />\n\n` +
                  `// Камер сонгоогүй үед хоосон төлөв\n` +
                  `<CameraPlayer camera={null} />`
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="overflow-hidden">
                    <CameraPlayer camera={CAMERAS[1]} src={demoClip} />
                  </Card>
                  <Card className="min-h-60 overflow-hidden">
                    <CameraPlayer camera={null} />
                  </Card>
                </div>
              </Specimen>
            </Group>

            <Group title="EventCard — үзэгдлийн карт">
              <Specimen
                fit
                code={`<EventCard\n  type="crowd"\n  image={snapshotUrl}\n  cameraId="cam-sukhbaatar"\n  time="23:14:08"\n  boxes={[{ x, y, w, h, label: "23 хүн" }]}\n/>`}
              >
                <EventCard
                  type="crowd"
                  image={snapCrowd}
                  cameraId="cam-sukhbaatar"
                  time="23:14:08"
                  boxes={EVENTS[0].boxes}
                  className="w-full"
                />
              </Specimen>
              <Specimen
                fit
                code={`<EventCard\n  type="intrusion"\n  …\n  region={[[x, y], …]}\n  tags={["Хориотой бүс"]}\n/>`}
              >
                <EventCard
                  type="intrusion"
                  image={snapIntrusion}
                  cameraId="cam-narnii-zam"
                  time="23:12:41"
                  boxes={EVENTS[1].boxes}
                  region={EVENTS[1].region}
                  tags={["Хориотой бүс"]}
                  className="w-full"
                />
              </Specimen>
              <Specimen
                fit
                code={`<EventCard\n  title="Замд зогссон машин"\n  cameraName="Нарны зам"\n  …\n/>`}
              >
                <EventCard
                  title="Замд зогссон машин"
                  image={snapVehicle}
                  cameraId="cam-narnii-zam"
                  cameraName="Нарны зам"
                  time="22:58:30"
                  boxes={EVENTS[4].boxes}
                  tags={["Зогсоол"]}
                  className="w-full"
                />
              </Specimen>
              <Specimen fit code={`<EventCard\n  …\n  selected\n  menu={<DropdownMenu>…</DropdownMenu>}\n/>`}>
                <EventCard
                  type="loitering"
                  image={snapLoitering}
                  cameraId="cam-bayanzurkh"
                  time="23:09:55"
                  boxes={EVENTS[2].boxes}
                  selected
                  menu={<EventMenu />}
                  className="w-full"
                />
              </Specimen>
            </Group>

            <Group title="FilterChip — олноос сонгох шүүлтүүр">
              <Specimen code={`<FilterChip\n  label="Камер"\n  options={[…]}\n  value={[]}\n  onChange={…}\n/>`}>
                <FilterChip label="Камер" options={CAMERA_FILTER_OPTIONS} value={[]} onChange={() => {}} />
              </Specimen>
              <Specimen code={`<FilterChip\n  label="Төрөл"\n  options={[…]}\n  value={["fire", "intrusion"]}\n  onChange={setTypes}\n/>`}>
                <FilterChip label="Төрөл" options={TYPE_OPTIONS} value={chipDemo} onChange={setChipDemo} />
              </Specimen>
              <Specimen code={`<FilterChip icon={<Video />} label="Камер" … />`}>
                <FilterChip
                  icon={<Video />}
                  label="Камер"
                  options={CAMERA_FILTER_OPTIONS}
                  value={[]}
                  onChange={() => {}}
                />
              </Specimen>
            </Group>
          </Section>

          {/* ─── Товч ─────────────────────────────────────────── */}
          <Section
            id="button"
            title="Товч"
            description="Үйлдэл хийх товч, унадаг цэс, сонголт, асаах/унтраах товч. Өнгийг variant-аар, хэмжээг size-аар сонгоно."
            imports={[
              "Button",
              "SettingsButton",
              "EditButton",
              "DropdownMenu",
              "DropdownMenuTrigger",
              "DropdownMenuContent",
              "DropdownMenuItem",
              "DropdownMenuLabel",
              "DropdownMenuSeparator",
              "Select",
              "Toggle",
            ]}
          >
            <Group title="Button — variant (өнгө)">
              <Specimen code="<Button>Хадгалах</Button>">
                <Button>Хадгалах</Button>
              </Specimen>
              <Specimen code={`<Button variant="outline">Болих</Button>`}>
                <Button variant="outline">Болих</Button>
              </Specimen>
              <Specimen code={`<Button variant="ghost">Дэлгэрэнгүй</Button>`}>
                <Button variant="ghost">Дэлгэрэнгүй</Button>
              </Specimen>
              <Specimen code={`<Button variant="danger">Устгах</Button>`}>
                <Button variant="danger">Устгах</Button>
              </Specimen>
              <Specimen code="<Button disabled>Идэвхгүй</Button>">
                <Button disabled>Идэвхгүй</Button>
              </Specimen>
            </Group>

            <Group title="Button — size (хэмжээ)">
              <Specimen code={`<Button size="sm">Жижиг</Button>`}>
                <Button size="sm">Жижиг</Button>
              </Specimen>
              <Specimen code={`<Button size="md">Дунд</Button>`}>
                <Button size="md">Дунд</Button>
              </Specimen>
              <Specimen code={`<Button size="lg">Том</Button>`}>
                <Button size="lg">Том</Button>
              </Specimen>
              <Specimen code="<Button><Plus /> Нэмэх</Button>">
                <Button>
                  <Plus /> Нэмэх
                </Button>
              </Specimen>
              <Specimen code={`<Button size="icon">\n  <Search />\n</Button>`}>
                <Button size="icon" variant="outline" aria-label="Хайх">
                  <Search />
                </Button>
              </Specimen>
              <Specimen code={`<Button size="icon-sm">\n  <Search />\n</Button>`}>
                <Button size="icon-sm" variant="outline" aria-label="Хайх">
                  <Search />
                </Button>
              </Specimen>
              <Specimen code={`<Button asChild>\n  <a href="…">Холбоос</a>\n</Button>`}>
                <Button asChild variant="outline">
                  <a href="#button">Холбоос</a>
                </Button>
              </Specimen>
            </Group>

            <Group title="Дүрстэй жижиг товч">
              <Specimen code="<SettingsButton />">
                <SettingsButton />
              </Specimen>
              <Specimen code="<EditButton />">
                <EditButton />
              </Specimen>
              <Specimen code={`<SettingsButton variant="ghost" />`}>
                <SettingsButton variant="ghost" />
              </Specimen>
              <Specimen code={`<EditButton variant="ghost" />`}>
                <EditButton variant="ghost" />
              </Specimen>
              <Specimen code={`<SettingsButton size="icon" />`}>
                <SettingsButton size="icon" />
              </Specimen>
              <Specimen code={`<EditButton size="icon" />`}>
                <EditButton size="icon" />
              </Specimen>
            </Group>

            <Group title="DropdownMenu — үйлдлийн цэс">
              <Specimen
                wide
                code={
                  "<DropdownMenu>\n" +
                  "  <DropdownMenuTrigger asChild>\n" +
                  '    <Button variant="outline">Үйлдэл <ChevronDown /></Button>\n' +
                  "  </DropdownMenuTrigger>\n" +
                  "  <DropdownMenuContent>\n" +
                  "    <DropdownMenuLabel>…</DropdownMenuLabel>\n" +
                  "    <DropdownMenuItem onSelect={…}><Pencil /> Засах</DropdownMenuItem>\n" +
                  "    <DropdownMenuSeparator />\n" +
                  '    <DropdownMenuItem variant="danger">…</DropdownMenuItem>\n' +
                  "  </DropdownMenuContent>\n" +
                  "</DropdownMenu>"
                }
              >
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Үйлдэл <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Сүхбаатарын талбай</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => setLastAction("Засах")}>
                        <Pencil /> Засах
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setLastAction("Татах")}>
                        <Download /> Бичлэг татах
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Pin /> Тогтоох (идэвхгүй)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="danger" onSelect={() => setLastAction("Устгах")}>
                        <Trash /> Устгах
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="text-xs text-ink-muted">
                    сонгосон: <code>{lastAction ?? "—"}</code>
                  </span>
                </div>
              </Specimen>

              <Specimen
                wide
                code={
                  "<DropdownMenu>\n" +
                  "  <DropdownMenuTrigger asChild>\n" +
                  '    <Button size="icon-sm" variant="ghost">\n' +
                  "      <EllipsisVertical />\n" +
                  "    </Button>\n" +
                  "  </DropdownMenuTrigger>\n" +
                  '  <DropdownMenuContent align="end">…</DropdownMenuContent>\n' +
                  "</DropdownMenu>"
                }
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="ghost" aria-label="Цэс">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setLastAction("Засах")}>
                      <Pencil /> Засах
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="danger" onSelect={() => setLastAction("Устгах")}>
                      <Trash /> Устгах
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Specimen>
            </Group>

            <Group title="Select — жагсаалтаас нэгийг сонгох">
              <Specimen
                code={`<Select\n  options={[…]}\n  value={cameraId}\n  onChange={setCameraId}\n  placeholder="Камер сонгох"\n/>`}
              >
                <div className="flex w-full flex-col items-center gap-2">
                  <Select
                    options={CAMERA_OPTIONS}
                    value={cameraId}
                    onChange={setCameraId}
                    placeholder="Камер сонгох"
                    aria-label="Камер"
                  />
                  <span className="text-xs text-ink-muted">
                    value = <code>{cameraId ? `"${cameraId}"` : "undefined"}</code>
                  </span>
                </div>
              </Specimen>
              <Specimen code={`<Select options={[…]} defaultValue="1h" />`}>
                <Select options={RANGES} defaultValue="1h" aria-label="Хугацаа" />
              </Specimen>
              <Specimen code={`<Select options={[…]} placeholder="…" disabled />`}>
                <Select options={RANGES} placeholder="Идэвхгүй" disabled aria-label="Идэвхгүй" />
              </Specimen>
            </Group>

            <Group title="Toggle — дарахад асч, дахин дарахад унтарна">
              <Specimen
                code={`<Toggle\n  pressed={muted}\n  onPressedChange={setMuted}\n>\n  {muted ? <VolumeX /> : <Volume2 />}\n</Toggle>`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Toggle
                    pressed={muted}
                    onPressedChange={setMuted}
                    size="icon"
                    aria-label="Дуу хаах"
                  >
                    {muted ? <VolumeX /> : <Volume2 />}
                  </Toggle>
                  <span className="text-xs text-ink-muted">
                    muted = <code>{String(muted)}</code>
                  </span>
                </div>
              </Specimen>
              <Specimen code="<Toggle><Pin /> Тогтоох</Toggle>">
                <Toggle>
                  <Pin /> Тогтоох
                </Toggle>
              </Specimen>
              <Specimen code={`<Toggle variant="outline" defaultPressed>\n  <Bell /> Мэдэгдэл\n</Toggle>`}>
                <Toggle variant="outline" defaultPressed>
                  <Bell /> Мэдэгдэл
                </Toggle>
              </Specimen>
              <Specimen code={`<Toggle size="icon-sm" variant="outline">\n  <Pin />\n</Toggle>`}>
                <Toggle size="icon-sm" variant="outline" aria-label="Тогтоох">
                  <Pin />
                </Toggle>
              </Specimen>
              <Specimen code="<Toggle disabled>Идэвхгүй</Toggle>">
                <Toggle disabled>Идэвхгүй</Toggle>
              </Specimen>
            </Group>
          </Section>

          {/* ─── Badge ────────────────────────────────────────── */}
          <Section
            id="badge"
            title="Badge"
            description="Жижиг шошго: төлөв, ангилал. CameraStatusBadge, EventBadge нь Badge дээр суурилсан бэлэн хувилбарууд."
            imports={["Badge", "CameraStatusBadge", "EventBadge"]}
          >
            <Group title="Badge — variant">
              <Specimen code="<Badge>Шинэ</Badge>">
                <Badge>Шинэ</Badge>
              </Specimen>
              <Specimen code={`<Badge variant="outline">v0.1.0</Badge>`}>
                <Badge variant="outline">v0.1.0</Badge>
              </Specimen>
              <Specimen code={`<Badge variant="online" dot>Идэвхтэй</Badge>`}>
                <Badge variant="online" dot>
                  Идэвхтэй
                </Badge>
              </Specimen>
              <Specimen code={`<Badge variant="offline" dot>Унтраалттай</Badge>`}>
                <Badge variant="offline" dot>
                  Унтраалттай
                </Badge>
              </Specimen>
              <Specimen code={`<Badge variant="danger">Яаралтай</Badge>`}>
                <Badge variant="danger">Яаралтай</Badge>
              </Specimen>
              <Specimen code={`<Badge variant="warning">Анхаар</Badge>`}>
                <Badge variant="warning">Анхаар</Badge>
              </Specimen>
              <Specimen code={`<Badge variant="info">Мэдээлэл</Badge>`}>
                <Badge variant="info">Мэдээлэл</Badge>
              </Specimen>
            </Group>

            <Group title="CameraStatusBadge — камерын төлөв">
              <Specimen code={`<CameraStatusBadge status="online" />`}>
                <CameraStatusBadge status="online" />
              </Specimen>
              <Specimen code={`<CameraStatusBadge status="offline" />`}>
                <CameraStatusBadge status="offline" />
              </Specimen>
            </Group>

            <Group title="EventBadge — үзэгдлийн төрөл">
              {EVENT_TYPES.map((type) => (
                <Specimen key={type} code={`<EventBadge type="${type}" />`}>
                  <EventBadge type={type} />
                </Specimen>
              ))}
            </Group>
          </Section>

          {/* ─── Мэдэгдэл ─────────────────────────────────────── */}
          <Section
            id="alert"
            title="Мэдэгдэл"
            description="Alert — ерөнхий мэдэгдэл. EventAlert — analyzer-ийн илрүүлсэн үзэгдэл."
            imports={["Alert", "EventAlert"]}
          >
            <Group title="Alert — variant">
              <Specimen wide code={`<Alert variant="info" icon={<Info />}>…</Alert>`}>
                <Alert variant="info" icon={<Info />}>
                  3 камер холбогдсон байна.
                </Alert>
              </Specimen>
              <Specimen wide code={`<Alert variant="warning" icon={<TriangleAlert />}>…</Alert>`}>
                <Alert variant="warning" icon={<TriangleAlert />}>
                  Хиймэл дагуулын зураг z14-ээс дээш бүдгэрнэ.
                </Alert>
              </Specimen>
              <Specimen wide code={`<Alert variant="danger" icon={<CircleAlert />}>…</Alert>`}>
                <Alert variant="danger" icon={<CircleAlert />}>
                  Урсгал ачаалагдсангүй.
                </Alert>
              </Specimen>
              <Specimen
                wide
                code={`<Alert variant="overlay" icon={<Info />}>…</Alert>`}
                bodyClassName="bg-[linear-gradient(135deg,#64748b,#0f172a)]"
              >
                <Alert variant="overlay" icon={<Info />} className="w-fit">
                  Газрын зураг, видео дээр давхарлана.
                </Alert>
              </Specimen>
            </Group>

            <Group title="EventAlert — үзэгдлийн төрөл бүр">
              {EVENT_TYPES.map((type, i) => {
                const camera = CAMERAS[i % CAMERAS.length];
                const danger = EVENT_META[type].tone === "danger";
                return (
                  <Specimen
                    key={type}
                    wide
                    code={
                      `<EventAlert type="${type}" cameraName="…" cameraId="…" time="…"\n` +
                      `  action={<Button variant="${danger ? "danger" : "outline"}" size="sm">Шалгах</Button>} />`
                    }
                  >
                    <EventAlert
                      type={type}
                      cameraName={camera.name}
                      cameraId={camera.id}
                      time={`${i + 1} минутын өмнө`}
                      action={
                        <Button size="sm" variant={danger ? "danger" : "outline"}>
                          Шалгах
                        </Button>
                      }
                    />
                  </Specimen>
                );
              })}
            </Group>
          </Section>

          {/* ─── Card ─────────────────────────────────────────── */}
          <Section
            id="card"
            title="Card"
            description="Хүрээтэй хайрцаг. Хэсгүүдээс угсарна — хэрэггүй хэсгээ орхиж болно."
            imports={["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"]}
          >
            <Group title="Card">
              <Specimen
                wide
                code={
                  "<Card>\n" +
                  "  <CardHeader>\n" +
                  "    <CardTitle>…</CardTitle>\n" +
                  "    <CardDescription>…</CardDescription>\n" +
                  "  </CardHeader>\n" +
                  "  <CardContent>…</CardContent>\n" +
                  "  <CardFooter>…</CardFooter>\n" +
                  "</Card>"
                }
              >
                <Card className="max-w-sm">
                  <CardHeader>
                    <CardTitle>Сүхбаатарын талбай</CardTitle>
                    <CardDescription>cam-sukhbaatar</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-ink-muted">
                    47.9186, 106.9176 — Сүхбаатар дүүрэг
                  </CardContent>
                  <CardFooter>
                    <CameraStatusBadge status="online" />
                    <div className="ml-auto flex gap-1">
                      <EditButton variant="ghost" />
                      <SettingsButton variant="ghost" />
                    </div>
                  </CardFooter>
                </Card>
              </Specimen>
            </Group>
          </Section>

          {/* ─── Оролт ────────────────────────────────────────── */}
          <Section
            id="input"
            title="Оролт"
            description="Текст бичих талбар ба хэд хэдэн сонголтоос нэгийг сонгох товчнууд."
            imports={["Input", "SegmentedControl"]}
          >
            <Group title="Input">
              <Specimen code={`<Input placeholder="Камер хайх…" />`}>
                <Input placeholder="Камер хайх…" />
              </Specimen>
              <Specimen code="<Input disabled />">
                <Input placeholder="Идэвхгүй" disabled />
              </Specimen>
              <Specimen code="<Input aria-invalid />">
                <Input defaultValue="буруу утга" aria-invalid />
              </Specimen>
            </Group>

            <Group title="SegmentedControl">
              <Specimen
                wide
                code={`<SegmentedControl options={[…]} value={layer} onChange={setLayer} />`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <SegmentedControl options={LAYERS} value={layer} onChange={setLayer} />
                  <span className="text-sm text-ink-muted">
                    layer = <code>"{layer}"</code>
                  </span>
                </div>
              </Specimen>
            </Group>
          </Section>

          {/* ─── Төлөв ────────────────────────────────────────── */}
          <Section
            id="state"
            title="Төлөв"
            description="Ачаалж байгаа болон харуулах зүйлгүй үеийн төлөв."
            imports={["Spinner", "EmptyState"]}
          >
            <Group title="Spinner">
              <Specimen code="<Spinner />">
                <Spinner />
              </Specimen>
              <Specimen code={`<Spinner className="size-6 text-ink-muted" />`}>
                <Spinner className="size-6 text-ink-muted" />
              </Specimen>
              <Specimen code={`<Spinner className="size-8 text-info" />`}>
                <Spinner className="size-8 text-info" />
              </Specimen>
            </Group>

            <Group title="EmptyState">
              <Specimen
                wide
                code={`<EmptyState icon={<Video />} title="…" description="…" action={<Button>…</Button>} />`}
              >
                <EmptyState
                  icon={<Video />}
                  title="Камер алга"
                  description="Энэ бүсэд одоогоор камер бүртгэгдээгүй байна."
                  action={
                    <Button size="sm">
                      <Plus /> Камер нэмэх
                    </Button>
                  }
                />
              </Specimen>
            </Group>
          </Section>

          {/* ─── Layout ───────────────────────────────────────── */}
          <Section
            id="layout"
            title="Layout"
            description="Хуудасны дээд, доод хэсэг."
            imports={["Header", "Footer"]}
          >
            <Group title="Header">
              <Specimen
                wide
                bodyClassName="p-0"
                code={`<Header title="УБ камер" subtitle="4 камер" actions={<><Badge …/><SettingsButton /></>} />`}
              >
                <Header
                  title="УБ камер"
                  subtitle="4 камер"
                  actions={
                    <>
                      <Badge variant="online" dot>
                        3 онлайн
                      </Badge>
                      <SettingsButton />
                    </>
                  }
                />
              </Specimen>
            </Group>

            <Group title="Footer">
              <Specimen wide bodyClassName="p-0" code="<Footer>…</Footer>">
                <Footer>
                  <span>© Mongol AIVA</span>
                  <span>v0.1.0</span>
                </Footer>
              </Specimen>
            </Group>
          </Section>

        </main>
      </div>

      <Footer>
        <span>mongol-aiva-ui</span>
        <span>{TOTAL} компонент</span>
      </Footer>
    </div>
  );
}

/** Үзэгдлийн картын ⋮ цэс — жишээнүүдэд давтагддаг тул тусад нь. */
function EventMenu({ onOpenCamera }: { onOpenCamera?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="Цэс">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onOpenCamera && (
          <>
            <DropdownMenuItem onSelect={onOpenCamera}>
              <Video /> Камерыг шууд харах
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <ScanSearch /> Зургаар хайх
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ImageDown /> Агшин зураг татах
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Route /> Замнал харах
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings /> Камерын тохиргоо
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Нэг бүлэг компонент: гарчиг, тайлбар, импортын мөр. */
function Section({
  id,
  title,
  description,
  imports,
  children,
}: {
  id: string;
  title: string;
  description: string;
  imports: string[];
  children: React.ReactNode;
}) {
  // Урт бол мөр бүрт нэг нэр — хэвтээ гүйлгэхгүйгээр уншигдана.
  const oneLine = `import { ${imports.join(", ")} } from "mongol-aiva-ui";`;
  const importCode =
    oneLine.length <= 90
      ? oneLine
      : `import {\n${imports.map((name) => `  ${name},`).join("\n")}\n} from "mongol-aiva-ui";`;

  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-ink-muted">{description}</p>
        <pre className="overflow-x-auto rounded-md bg-ink px-4 py-3 font-mono text-xs text-line-soft">
          {importCode}
        </pre>
      </div>
      {children}
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{title}</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">{children}</div>
    </div>
  );
}

/** Компонент дээрээ, түүнийг гаргах код доороо. */
function Specimen({
  code,
  wide,
  fit,
  bodyClassName,
  children,
}: {
  code: string;
  /** Мөрийг бүтнээр нь эзэлнэ — Alert, Card гэх мэт өргөн компонентод. */
  wide?: boolean;
  /** Тогтмол өндрийн оронд агуулгаараа — EventCard гэх мэт өндөр компонентод. */
  fit?: boolean;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-line bg-surface",
        wide && "col-span-full",
      )}
    >
      {/* Тогтмол өндөр — нэг мөрөнд байгаа компонентууд ижил түвшинд харагдана. */}
      <div
        className={cn(
          "p-4",
          !wide && !fit && "flex h-24 items-center justify-center",
          bodyClassName,
        )}
      >
        {children}
      </div>
      <figcaption className="flex-1 border-t border-line bg-surface-muted px-3 py-2 font-mono text-[11px] leading-relaxed wrap-anywhere whitespace-pre-wrap text-ink">
        {code}
      </figcaption>
    </figure>
  );
}
