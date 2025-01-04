import fs from "fs-extra";
import { glob } from "glob";
import { processMarkdownFile } from "./processors/markdown";
import { copyAssets } from "./processors/assets";
import { fetchExternalArticles } from "./processors/feed";
import { fetchGitHubProjects } from "./processors/github";
import type { Contents } from "../../core/types";
import { configs } from "../../core/configs";
import { resolve } from "node:path";

const main = async (): Promise<void> => {
  // 出力ディレクトリの準備
  await fs.ensureDir(configs.outputDir);
  await fs.emptyDir(configs.outputDir);
  await fs.ensureDir(resolve(configs.outputDir, "assets"));

  // Markdownファイルの処理
  const markdownFiles = await glob("content/**/*.md");
  const internalArticles = await Promise.all(
    markdownFiles.map(processMarkdownFile)
  );

  // アセットのコピー
  await copyAssets();

  const externalArticles = await Promise.all(
    configs.feeds.map(async (feed) => {
      const articles = await fetchExternalArticles(feed.url, feed.kind);

      return {
        group: feed.kind,
        articles,
      } as const;
    })
  );

  // GitHubプロジェクト情報の取得
  const projects = await fetchGitHubProjects();

  // 最終的なコンテンツの生成
  const contents: Contents = {
    internalArticles,
    externalArticles,
    projects,
  };

  // JSONファイルの出力
  await fs.writeJSON(resolve(configs.outputDir, "contents.json"), contents, {
    spaces: 2,
  });
};

main()
  .then(() => {
    console.log("Build succeeded!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
