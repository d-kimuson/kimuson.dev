import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/copy-article-assets.ts"],
  dts: true,
  sourcemap: true,
  target: "esnext",
  format: ["esm", "cjs"],
  tsconfig: "tsconfig.json",
  external: [],
});
