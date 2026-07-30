import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/ui/*.tsx",
    "src/hooks/*.ts",
    "src/lib/*.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  deps: {
    neverBundle: ["react", "react-dom"],
  },
  unbundle: true,
  sourcemap: true,
});