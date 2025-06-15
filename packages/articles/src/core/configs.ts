import { dirname, resolve } from "node:path";
import findPackageJson from "find-package-json";

const found = findPackageJson(resolve(process.cwd())).next();
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
          date: "2023-09-06T07:00:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2023/07/21/163000",
          date: "2023-07-21T07:30:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2023/05/15/163000",
          date: "2023-05-15T07:30:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2022/12/01/000000",
          date: "2022-12-01T00:00:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2022/01/17/103000",
          date: "2022-01-17T01:30:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/12/10/000000",
          date: "2021-12-10T00:00:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/12/02/000000",
          date: "2021-12-02T00:00:00.000Z",
        },
        {
          url: "https://tech.mobilefactory.jp/entry/2021/10/14/100000",
          date: "2021-10-14T01:00:00.000Z",
        },
      ],
    },
    {
      group: "エス・エム・エス テックブログ",
      articles: [
        {
          url: "https://tech.bm-sms.co.jp/entry/2025/04/15/110000",
          date: "2025-04-15T02:00:00.000Z",
        },
        {
          url: "https://tech.bm-sms.co.jp/entry/2025/02/04/110000",
          date: "2025-02-04T02:00:00.000Z",
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
