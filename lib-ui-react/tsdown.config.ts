import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/ui/button.tsx",
    "src/components/ui/card-counter.tsx",
    "src/hooks/use-counter.ts",
    "src/lib/utils.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  unbundle: true,
  sourcemap: true,
});