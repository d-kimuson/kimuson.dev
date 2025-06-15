import fs from "fs-extra";
import { glob } from "glob";
import { processMarkdownFile } from "./processors/markdown";
import { copyAssets } from "./processors/assets";
import { fetchExternalArticles } from "./processors/feed";
import { fetchGitHubProjects } from "./processors/github";
import { fetchArticleFromOGP } from "./processors/ogp";
import type { Contents, ExternalArticle } from "../../core/types";
import { configs } from "../../core/configs";
import { resolve } from "node:path";
import { logValiError } from "../../core/utils/valibot";

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

  const feedArticles = await Promise.all(
    configs.feeds.map(async (feed) => {
      const articles = await fetchExternalArticles(feed.url, feed.kind);

      return {
        group: feed.kind,
        articles,
      } as const;
    })
  );

  const noFeedArticles = await Promise.all(
    configs.articles.map(async ({ group, articles }) => ({
      group,
      articles: await Promise.all(
        articles.map(
          async ({ url, date }) => await fetchArticleFromOGP(group, url, date)
        )
      ),
    }))
  );

  const externalArticles = [...feedArticles, ...noFeedArticles];

  // GitHubプロジェクト情報の取得
  const projects = await fetchGitHubProjects();

  // 最終的なコンテンツの生成
  const contents: Contents = {
    internalArticles,
    externalArticles,
    projects,
    speeches: [...configs.speakersDecks],
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
    if (!logValiError(error)) {
      console.error(error);
    }
    process.exit(1);
  });
