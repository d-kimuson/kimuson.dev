import { resolve } from "node:path";

const __dirname = resolve(import.meta.dirname);
const projectDir = resolve(__dirname, "..", "..");

export const configs = {
  projectDir,
  outputDir: resolve(projectDir, "summary"),
  feeds: [
    {
      kind: "zenn",
      url: "https://zenn.dev/kimuson/feed",
    },
  ],
} as const;
