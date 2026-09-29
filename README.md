# mongol-aiva-ui

Mongol AIVA-гийн бэлэн React компонентууд: камерын шууд видео, analyzer-ийн
илрүүлсэн үзэгдлүүд, товч, шүүлтүүр, цэс гэх мэт. Нэг удаа энд бичээд
UbCam болон бусад төсөлд импортлож ашиглана.

- **Үзүүлэн (showcase):** `npm run dev` → <http://localhost:3200>.
  Компонент бүр, түүнийг гаргах код хамт харагдана.
- React 18 / 19, TypeScript-ийн төрлүүд хамт ирнэ.
- Импортлох төсөлд **Tailwind суулгах шаардлагагүй** — бүх CSS `styles.css`-д багтсан.

---

## Агуулга

| Бүлэг | Компонент | Юунд |
|---|---|---|
| **Хяналтын дэлгэц** | `CameraPlayer` | Камерын шууд видео (WebRTC → HLS) эсвэл бичлэг (mp4) |
| | `EventCard` | Үзэгдлийн карт: агшин зураг, илрүүлэлтийн хүрээ, бүс, цаг, ⋮ цэс |
| | `FilterChip` | Олноос сонгох шүүлтүүр — чагттай жагсаалт + "Хэрэглэх" |
| **Товч** | `Button` | `variant`: default · outline · ghost · danger, `size`: sm · md · lg · icon · icon-sm |
| | `SettingsButton`, `EditButton` | Араа, харандаатай жижиг товч |
| | `DropdownMenu` | Товч дарахад гарах үйлдлийн цэс |
| | `Select` | Жагсаалтаас нэгийг сонгох |
| | `Toggle` | Дарахад асч, дахин дарахад унтарна |
| **Badge** | `Badge` | default · outline · online · offline · danger · warning · info |
| | `CameraStatusBadge` | Камерын төлөв: Онлайн / Офлайн |
| | `EventBadge` | Үзэгдлийн төрөл: гал, хүчирхийлэл, нэвтрэлт… |
| **Мэдэгдэл** | `Alert` | info · warning · danger · overlay |
| | `EventAlert` | Analyzer-ийн илрүүлсэн үзэгдлийн мэдэгдэл |
| **Card** | `Card` | `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`-ээс угсарна |
| **Оролт** | `Input` | Текст бичих талбар |
| | `SegmentedControl` | Цөөн сонголтоос нэгийг — товчнуудаар |
| **Төлөв** | `Spinner`, `EmptyState` | Ачаалж байна / харуулах зүйлгүй |
| **Layout** | `Header`, `Footer` | Хуудасны дээд, доод хэсэг |

Туслах зүйлс: `useCameraStream` (өөрийн `<video>`-д урсгал холбох hook),
`cn()`, `themeColor()`, `connectWhep()`, `EVENT_META`, төрлүүд
(`Camera`, `EventType`, `DetectionBox`…).

---

## Суулгах

Эхлээд энэ repo-г build хийнэ — импортлох төсөл `dist/`-ийг уншдаг:

```bash
cd mongol-aiva-ui
npm install
npm run build
```

Дараа нь импортлох төсөлдөө гурван аргын аль нэгээр:

### А. Холбоосоор — энэ санг зэрэг хөгжүүлж байх үед

Санд оруулсан өөрчлөлт шууд орж ирнэ.

```bash
# энэ repo-д — өөрчлөх бүрд dist/-ийг дахин бүтээнэ
npm run watch

# импортлох төсөлд (замыг өөрийнхөөрөө)
npm install ../mongol-aiva-ui
```

**`vite.config.ts`-д заавал нэмнэ:**

```ts
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
```

Үгүй бол React хоёр хувь ачаалагдаж, хуудас хоосон гарна
(`Cannot read properties of null (reading 'useContext')`).

### Б. Tarball — сервер рүү гаргах, бусадтай хуваалцах үед

```bash
# энэ repo-д
npm run build && npm pack          # → mongol-aiva-ui-0.1.0.tgz

# импортлох төсөлд
npm install ../mongol-aiva-ui/mongol-aiva-ui-0.1.0.tgz
```

`dedupe` хэрэггүй. Өөрчлөлт бүрийн дараа `build` → `pack` → `install`-ийг давтана.

### В. Git-ээс

`prepare` скрипт суулгах үед `dist/`-ийг автоматаар бүтээнэ:

```bash
npm install git+ssh://git@github.com/<байгууллага>/mongol-aiva-ui.git
```

---

## Ашиглах

**1. CSS-ийг нэг удаа** — `main.tsx`-д, өөрийн CSS-ийн **өмнө**
(тэгвэл таны CSS сангийнхыг дарж чадна):

```tsx
import "mongol-aiva-ui/styles.css";
import "./index.css";
```

**2. Компонентоо импортлоно:**

```tsx
import { Header, Button, CameraPlayer, EventCard } from "mongol-aiva-ui";
```

> **Next.js (App Router):** компонентууд hook ашигладаг тул `"use client"`
> гэсэн файл дотроос импортлоно. `styles.css`-ийг `app/layout.tsx`-д.

Бүх компонентын жишээ, тохиргоог showcase дээрээс хуулж авах нь хамгийн хялбар.
Доор гол хэрэглээнүүд.

### Хяналтын дэлгэц: Энгийн ↔ Үзэгдэл

```tsx
const [mode, setMode] = useState<"live" | "events">("live");

<Header
  title="Хяналт"
  actions={
    <SegmentedControl
      options={[
        { value: "live", label: "Энгийн" },
        { value: "events", label: "Үзэгдэл" },
      ]}
      value={mode}
      onChange={setMode}
    />
  }
/>;

{mode === "live" ? (
  <CameraPlayer camera={camera} whepBase={WHEP} hlsBase={HLS} />
) : (
  events.map((e) => <EventCard key={e.id} type={e.type} image={e.snapshotUrl} … />)
)}
```

Бүрэн жишээ (шүүлтүүр, эрэмбэ, цэс) — `showcase/app.tsx`, "Хяналтын дэлгэц" хэсэг.

### CameraPlayer

```tsx
// Шууд урсгал (MediaMTX / VSS) — эхлээд WebRTC (~0.3 сек), бүтэхгүй бол HLS
<CameraPlayer camera={camera} whepBase="http://192.168.1.27:7889" hlsBase="http://192.168.1.27:7888" />

// Бичлэг
<CameraPlayer camera={camera} src="/clips/cam-1.mp4" />

// camera={null} → "Камер сонгоогүй" хоосон төлөв
```

| VSS | `whepBase` | `hlsBase` |
|---|---|---|
| UbCam | `http://<хост>:7889` | `http://<хост>:7888` |
| AIVA vss | `https://<хост>:9889` | `https://<хост>:9888` |

Видеог `${whepBase}/${camera.id}/whep` хаягаас авна — `camera.id` нь урсгалын
нэр. `ch01` маягийн нэр бүү өг: AIVA analyzer "ch"+тоо агуулсан нэрийг
өөрөөр тайлбарладаг.

Загвар тохирохгүй бол (олон камерын тор гэх мэт) `useCameraStream`-ийг шууд:

```tsx
const { videoRef, transport, error } = useCameraStream(camera.id, { whepBase, hlsBase });
<video ref={videoRef} autoPlay muted playsInline />;
```

### EventCard

```tsx
<EventCard
  type="intrusion"                 // EventBadge + гарчиг EVENT_META-аас
  image={event.snapshotUrl}
  cameraId="cam-narnii-zam"
  time="23:12:41"
  boxes={[{ x: 0.6, y: 0.52, w: 0.04, h: 0.1, label: "хүн" }]}
  region={[[0.4, 0.2], [0.5, 0.2], [0.68, 0.66], [0.52, 0.72]]}
  tags={["Хориотой бүс"]}
  selected={openId === event.id}
  onClick={() => setOpenId(event.id)}
  menu={<DropdownMenu>…</DropdownMenu>}
/>
```

`boxes`, `region`-ийн координат **0–1 харьцаагаар** (зургийн өргөн, өндрөөс):
`x: 0.6` = зүүн захаас 60%. Analyzer пикселээр өгвөл зургийн хэмжээнд хуваана.
`type`-гүй бол `title`-ыг өөрөө өг.

### FilterChip

```tsx
<FilterChip
  label="Камер"
  options={cameras.map((c) => ({ value: c.id, label: c.name }))}
  value={cameraIds}
  onChange={setCameraIds}   // "Хэрэглэх" дарахад л дуудагдана
/>
```

### DropdownMenu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon-sm" variant="ghost" aria-label="Цэс"><EllipsisVertical /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={edit}><Pencil /> Засах</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="danger" onSelect={remove}><Trash /> Устгах</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Trigger-т `asChild` заавал — үгүй бол `<button>` дотор `<button>` үүснэ.

### Select ба SegmentedControl

Хоёулаа ижил `options` / `value` / `onChange` авдаг — сонголт олширвол
`SegmentedControl`-ийг `Select`-ээр шууд сольж болно.

```tsx
<Select options={cameraOptions} value={id} onChange={setId} placeholder="Камер сонгох" />
```

---

## Бараан горим

```ts
document.documentElement.classList.toggle("dark", isDark);
```

`<html>` дээр тавина. Доторх `div` дээр тавибал `DropdownMenu`, `Select`,
`FilterChip`-ийн цэс (body руу зурагддаг) цагаан хэвээр гарна.

---

## Tailwind-тэй төсөлд

Өөрөө Tailwind v4 ашигладаг бол сангийн өнгөний токенуудыг өөрийн кодод
хэрэглэж болно:

```css
/* index.css */
@import "tailwindcss";
@import "mongol-aiva-ui/theme.css";
```

```tsx
<div className="bg-surface text-ink dark:bg-surface-muted">…</div>
```

`styles.css`-ийг мөн импортолсоор байна — компонентуудын CSS тэнд.
`dark:` нь системийн тохиргоо биш, `.dark` классыг дагана.

Токенууд (`src/theme.css`): `surface`, `surface-muted`, `surface-accent`,
`ink`, `ink-muted`, `ink-inverse`, `line`, `line-soft`, `online`, `offline`,
`danger(-soft)`, `warning(-soft)`, `info(-soft)`, `primary`, `primary-fg`,
`overlay(-fg)`, `detection(-fg)`.

---

## Хөгжүүлэх

```bash
npm install
npm run dev             # showcase → http://localhost:3200
npm run build           # dist/ — бусад төсөл үүнийг импортолно
npm run watch           # build-ийг өөрчлөлт бүрд
npm run typecheck
npm run lint
npm run build:showcase  # showcase-dist/ — вэб сайт болгож байршуулна
```

### Бүтэц

```
src/
  index.ts             ← нүүр хаалга. Энд export хийгээгүй зүйл гадна харагдахгүй
  styles.css           ← dist/styles.css болно
  theme.css            ← өнгөний токенууд + бараан горим
  types.ts             ← Camera, CameraStatus
  lib/                 ← cn, themeColor, WHEP клиент
  components/
    ui/                ← Button, Select, FilterChip, … (ерөнхий)
    layout/            ← Header, Footer
    camera/            ← CameraPlayer, CameraStatusBadge, useCameraStream
    event/             ← EventCard, EventAlert, EventBadge, EVENT_META
showcase/              ← `npm run dev`-ийн үзүүлэн (dist-д орохгүй)
```

### Шинэ компонент нэмэх

1. `src/components/<бүлэг>/<нэр>.tsx` — файл үүсгэнэ.
2. Тэр хавтасны `index.ts`-д export хийнэ. **Үгүй бол бусад төсөлд харагдахгүй.**
3. `showcase/app.tsx` — `NAV` жагсаалт болон тохирох `Section`-д жишээ
   (`<Specimen code="…">`) нэмнэ.
4. `npm run typecheck && npm run build` — алдаагүй бол бэлэн.

### Дүрэм

- **Өнгийг шууд бичихгүй** (`#fff`, `bg-blue-500`) — `theme.css`-ийн токен
  (`bg-surface`, `text-danger`). Ингэснээр бараан горим автоматаар ажиллана.
  Шинэ өнгө хэрэгтэй бол `theme.css`-д токен нэмж, `.dark` блокт бараан утгыг нь өгнө.
- **Классыг угсарч бичихгүй** (`` `bg-${tone}` ``) — Tailwind эх кодоос бүтэн
  мөрөөр хайдаг. Хүснэгтээр бич (`event-alert.tsx`-ийн `TONE_CLASSES`-ийг үз).
- **`@/` товчлол бүү хэрэглэ** — харьцангуй зам (`../../lib/utils`).
  `.d.ts` файлд `@/` хэвээр үлдэж, импортлосон төсөлд олдохгүй болдог.
- `className`-ийг `cn()`-оор нийлүүлж дамжуулна — гаднаас дарж болдог байх.
- Элемент бүрт `data-slot="<нэр>"` — тест, CSS-ээс олоход.
- Radix-ийн primitive байгаа бол (цэс, popover, select) түүнийг ашигла —
  гарын удирдлага, дэлгэц уншигчийн дэмжлэг бэлэн ирнэ.

### Байршуулах

Showcase-ийг хоёр газар байршуулах тохиргоо бий:

- **Vercel** — `vercel.json`: `npm run build:showcase` → `showcase-dist/`.
- **GitHub Pages** — `.github/workflows/pages.yml`: `main` руу push хийх бүрт.
  Нэг удаа: repo → Settings → Pages → Source: "GitHub Actions".
