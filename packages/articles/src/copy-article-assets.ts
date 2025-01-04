import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { configs } from "./core/configs";
import { relative, resolve } from "node:path";

const [_pnpm, _copy_article_asserts, outputDir, ...args] = process.argv;

if (outputDir === undefined || args.length !== 0) {
  console.error("Usage: copy-article-asserts <output-dir>");
  process.exit(1);
}

for (const dirent of readdirSync(resolve(configs.outputDir, "assets"), {
  recursive: true,
  withFileTypes: true,
})) {
  if (dirent.isDirectory()) {
    continue;
  }

  const parentPath = resolve(
    outputDir,
    relative(configs.outputDir, dirent.parentPath)
  );

  mkdirSync(parentPath, {
    recursive: true,
  });
  copyFileSync(
    resolve(dirent.parentPath, dirent.name),
    resolve(parentPath, dirent.name)
  );
}

console.log("assets files successfully copied.");
