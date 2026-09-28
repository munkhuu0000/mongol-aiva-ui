import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { dependencies: Record<string, string>; peerDependencies: Record<string, string> };

// dependencies, peerDependencies нь dist-д багтахгүй — хэрэглэгч төсөл
// өөрийнхөөрөө шийднэ. React-ийг багтаавал апп дотор React хоёр хувь
// болж hook бүр "Invalid hook call" гэж унана.
const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  // `npm run dev` → компонентын үзүүлэн (showcase/). 3100 = UbCam.
  server: {
    host: "0.0.0.0",
    port: 3200,
  },

  ...(mode === "showcase"
    ? {
        // `npm run build:showcase` → үзүүлэнг энгийн вэб сайт болгоно
        // (GitHub Pages). "./" — сайт ямар замд байрлахаас үл хамаарна.
        base: "./",
        build: { outDir: "showcase-dist" },
      }
    : {
        // `npm run build` → бусад төсөл импортлох dist/.
        build: {
          lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            formats: ["es"],
            fileName: "index",
            cssFileName: "styles",
          },
          rolldownOptions: {
            external: (id: string) =>
              external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
          },
        },
      }),
}));
