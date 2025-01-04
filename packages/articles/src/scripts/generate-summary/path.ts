import { relative, resolve, dirname } from "node:path";
import { configs } from "../../core/configs";

export function convertImagePath(imagePath: string, filePath: string): string {
  if (imagePath.startsWith("http")) return imagePath;
  const absoluteImgPath = resolve(dirname(filePath), imagePath);
  const relativePath = relative(
    resolve(configs.projectDir, "content"),
    absoluteImgPath
  );
  return `/assets/${relativePath}`;
}

/**
 * /path/to/foo
 */
export function getSlugFromPath(filePath: string): string {
  return (
    "/" +
    relative("content", filePath)
      .replace(/\index.md$/, "")
      .replace(/\.md$/, "")
      .split("/")
      .map(encodeURIComponent)
      .join("/")
      .replace(/\/$/, "")
  );
}
