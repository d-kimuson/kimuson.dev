import { dirname, resolve } from "node:path";
import findPackageJson from "find-package-json";

const found = findPackageJson(resolve(import.meta.dirname)).next();
if (found === undefined || found.filename === undefined)
  throw new Error("package.json not found");
const projectDir = dirname(found.filename);

export const configs = {
  projectDir,
  outputDir: resolve(projectDir, "summary"),
  feeds: [
    {
      kind: "zenn",
      url: "https://zenn.dev/kimuson/feed",
    },
  ],
  articles: [
    {
      group: "Mobile Factory Tech Blog",
      articles: [
        {
          url: "https://tech.mobilefactory.jp/entry/2023/09/06/160000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2023/07/21/163000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2023/05/15/163000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2022/12/01/000000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2022/01/17/103000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/12/10/000000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/12/02/000000",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/10/14/100000",
        },
      ],
    },
  ],
  projects: [
    {
      url: "https://github.com/d-kimuson/ts-type-expand",
    },
    {
      url: "https://github.com/d-kimuson/type-predicates-generator",
    },
    {
      url: "https://github.com/d-kimuson/claude-crew",
    },
    {
      url: "https://github.com/d-kimuson/esa-mcp-server",
    },
    {
      url: "https://github.com/d-kimuson/react-router-typing",
    },
    {
      url: "https://github.com/d-kimuson/switchbot-api-openapi",
    },
    {
      url: "https://github.com/d-kimuson/github-actions-search",
    },
    {
      url: "https://github.com/d-kimuson/type-safe-prompt",
    },
  ],
  speakersDecks: [
    {
      url: "https://speakerdeck.com/kimuson",
    },
  ],
} as const;
