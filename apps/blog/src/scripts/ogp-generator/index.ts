import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { generateImage } from "./generate-image.js";
import { separateTitle } from "./separate-title.js";
import { join, dirname } from "node:path";
import matter from "gray-matter";
import { glob } from "glob";

export type GenerateOptions = {
  /** 出力ディレクトリ */
  outputDir: string;
  /** 記事ディレクトリ */
  articlesDir: string;
  /** 強制再生成するかどうか */
  force?: boolean;
};

/**
 * 単一記事のOGP画像を生成
 */
export const generateOgpForArticle = async (
  articleFilePath: string,
  outputDir: string,
  force = false
): Promise<void> => {
  // ディレクトリ構造を維持した出力パスを生成
  let relativePath = articleFilePath
    .replace(/\\/g, "/")
    .replace(/\.md$/, "")
    .replace(/^.*\/content\//, "");

  // index.md の場合は /index を削除して親ディレクトリ名を使用
  if (articleFilePath.endsWith("/index.md")) {
    relativePath = relativePath.replace(/\/index$/, "");
  }

  const outputFilePath = join(outputDir, `${relativePath}.png`);
  const outputFileDir = dirname(outputFilePath);

  // 強制再生成でない場合、既存ファイルをチェック
  if (!force) {
    try {
      await access(outputFilePath);
      console.log(`${relativePath}.png は既に存在します。スキップします。`);
      return;
    } catch {
      // ファイルが存在しない場合は生成を続行
    }
  }

  // 記事ファイルを読み込み
  const fileContent = await readFile(articleFilePath, "utf-8");
  const { data: frontmatter } = matter(fileContent);

  // タイトルを取得
  const title = frontmatter["Title"] ?? frontmatter["title"];
  if (!title || typeof title !== "string") {
    throw new Error(
      `タイトルがフロントマターに見つかりません: ${articleFilePath}`
    );
  }

  // タイトルを適切に分割
  const lines = separateTitle(title);

  // OGP画像を生成
  const image = await generateImage(lines);

  // 出力ディレクトリを作成
  await mkdir(outputFileDir, { recursive: true });

  // 画像を保存
  await writeFile(outputFilePath, image);

  console.log(`${relativePath}.png を生成しました。`);
};

/**
 * 複数記事のOGP画像を一括生成
 */
export const generateOgpBatch = async (
  options: GenerateOptions
): Promise<void> => {
  const { articlesDir, outputDir, force = false } = options;

  // 記事ファイルを検索
  const articleFiles = await glob("**/*.md", {
    cwd: articlesDir,
    absolute: true,
  });

  if (articleFiles.length === 0) {
    console.log("記事ファイルが見つかりませんでした。");
    return;
  }

  console.log(`${articleFiles.length}個の記事ファイルが見つかりました。`);

  let generated = 0;
  let skipped = 0;

  for (const articleFile of articleFiles) {
    try {
      // ディレクトリ構造を維持した出力パスを生成
      let relativePath = articleFile
        .replace(/\\/g, "/")
        .replace(/\.md$/, "")
        .replace(/^.*\/content\//, "");

      // index.md の場合は /index を削除して親ディレクトリ名を使用
      if (articleFile.endsWith("/index.md")) {
        relativePath = relativePath.replace(/\/index$/, "");
      }

      const outputFilePath = join(outputDir, `${relativePath}.png`);

      // 強制再生成でない場合、既存ファイルをチェック
      if (!force) {
        try {
          await access(outputFilePath);
          console.log(`${relativePath}.png は既に存在します。スキップします。`);
          skipped++;
          continue;
        } catch {
          // ファイルが存在しない場合は生成を続行
        }
      }

      // 記事ファイルを読み込み
      const fileContent = await readFile(articleFile, "utf-8");
      const { data: frontmatter } = matter(fileContent);

      // タイトルを取得
      const title = frontmatter["Title"] ?? frontmatter["title"];
      if (!title || typeof title !== "string") {
        throw new Error(
          `タイトルがフロントマターに見つかりません: ${articleFile}`
        );
      }

      // タイトルを適切に分割
      const lines = separateTitle(title);

      // OGP画像を生成
      const image = await generateImage(lines);

      // 出力ディレクトリを作成
      const outputFileDir = dirname(outputFilePath);
      await mkdir(outputFileDir, { recursive: true });

      // 画像を保存
      await writeFile(outputFilePath, image);

      console.log(`${relativePath}.png を生成しました。`);
      generated++;
    } catch (error) {
      console.error(`${articleFile} の処理中にエラーが発生しました:`, error);
    }
  }

  console.log(`\n処理完了: ${generated}個生成, ${skipped}個スキップ`);
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("使用方法:");
    console.error(
      "  単一ファイル: pnpm ogp <記事ファイルパス> [出力ディレクトリ] [--force]"
    );
    console.error(
      "  バッチ処理: pnpm ogp --batch [記事ディレクトリ] [出力ディレクトリ] [--force]"
    );
    console.error("");
    console.error("デフォルト:");
    console.error("  記事ディレクトリ: ../../packages/articles/content");
    console.error("  出力ディレクトリ: ./public/ogp");
    process.exit(1);
  }

  const force = args.includes("--force");
  const cleanArgs = args.filter((arg) => arg !== "--force");

  // デフォルトパス設定
  const defaultArticlesDir = "../../packages/articles/content";
  const defaultOutputDir = "./public/ogp";

  if (cleanArgs[0] === "--batch") {
    const articlesDir = cleanArgs[1] || defaultArticlesDir;
    const outputDir = cleanArgs[2] || defaultOutputDir;

    await generateOgpBatch({
      articlesDir,
      outputDir,
      force,
    });
  } else {
    if (cleanArgs.length < 1) {
      console.error("単一ファイル処理には記事ファイルパスが必要です。");
      process.exit(1);
    }

    const articleFilePath = cleanArgs[0]!;
    const outputDir = cleanArgs[1] || defaultOutputDir;

    await generateOgpForArticle(articleFilePath, outputDir, force);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
