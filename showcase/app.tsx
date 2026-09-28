import { useState } from "react";
import type * as React from "react";
import { CircleAlert, Info, Plus, Search, TriangleAlert, Video } from "lucide-react";

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
  EditButton,
  EmptyState,
  EVENT_META,
  EventAlert,
  EventBadge,
  Footer,
  Header,
  Input,
  SegmentedControl,
  SettingsButton,
  Spinner,
  type Camera,
  type EventType,
} from "../src";

// UbCam-ийн VSS (MediaMTX). Өөр машин дээр бол HOST-ыг л солино.
const HOST = "192.168.1.27";
const ENDPOINTS = {
  whepBase: `http://${HOST}:7889`,
  hlsBase: `http://${HOST}:7888`,
};

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

/** Хажуугийн цэс. Нийт компонентын тоо эндээс гарна. */
const NAV = [
  { id: "button", title: "Товч", items: ["Button", "SettingsButton", "EditButton"] },
  { id: "badge", title: "Badge", items: ["Badge", "CameraStatusBadge", "EventBadge"] },
  { id: "alert", title: "Мэдэгдэл", items: ["Alert", "EventAlert"] },
  { id: "card", title: "Card", items: ["Card"] },
  { id: "input", title: "Оролт", items: ["Input", "SegmentedControl"] },
  { id: "state", title: "Төлөв", items: ["Spinner", "EmptyState"] },
  { id: "layout", title: "Layout", items: ["Header", "Footer"] },
  { id: "camera", title: "Камер", items: ["CameraPlayer"] },
];
const TOTAL = NAV.reduce((sum, group) => sum + group.items.length, 0);

export function App() {
  const [selected, setSelected] = useState<Camera | null>(null);
  const [layer, setLayer] = useState<(typeof LAYERS)[number]["value"]>("map");

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted text-ink">
      <Header
        className="sticky top-0 z-10"
        title="Mongol AIVA UI"
        subtitle={`${TOTAL} компонент`}
        actions={<Badge variant="outline">v0.1.0</Badge>}
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
          {/* ─── Товч ─────────────────────────────────────────── */}
          <Section
            id="button"
            title="Товч"
            description="Үйлдэл хийх товчнууд. Өнгийг variant-аар, хэмжээг size-аар сонгоно."
            imports={["Button", "SettingsButton", "EditButton"]}
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

          {/* ─── Камер ────────────────────────────────────────── */}
          <Section
            id="camera"
            title="Камер"
            description={`Шууд видео — эхлээд WebRTC, бүтэхгүй бол HLS. Видео ${HOST}-ийн MediaMTX-ээс ирнэ; сервер асаагүй бол алдааны төлөв харагдана.`}
            imports={["CameraPlayer"]}
          >
            <Group title="CameraPlayer — жагсаалтаас камер сонго">
              <Specimen
                wide
                code={`<CameraPlayer camera={camera} whepBase="http://${HOST}:7889" hlsBase="http://${HOST}:7888" />`}
              >
                <div className="grid gap-4 md:grid-cols-[240px_1fr]">
                  <div className="flex flex-col gap-1">
                    {CAMERAS.map((camera) => (
                      <button
                        key={camera.id}
                        type="button"
                        onClick={() => setSelected(camera)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm",
                          selected?.id === camera.id ? "bg-surface-accent" : "hover:bg-surface-muted",
                        )}
                      >
                        <span className="truncate">{camera.name}</span>
                        <CameraStatusBadge status={camera.status} />
                      </button>
                    ))}
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelected(null)}>
                      Сонголт цуцлах
                    </Button>
                  </div>

                  <Card className="min-h-72 overflow-hidden">
                    <CameraPlayer camera={selected} {...ENDPOINTS} />
                  </Card>
                </div>
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
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-ink-muted">{description}</p>
        <pre className="overflow-x-auto rounded-md bg-ink px-4 py-3 font-mono text-xs text-line-soft">
          {`import { ${imports.join(", ")} } from "mongol-aiva-ui";`}
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
  bodyClassName,
  children,
}: {
  code: string;
  /** Мөрийг бүтнээр нь эзэлнэ — Alert, Card гэх мэт өргөн компонентод. */
  wide?: boolean;
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
          !wide && "flex h-24 items-center justify-center",
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
