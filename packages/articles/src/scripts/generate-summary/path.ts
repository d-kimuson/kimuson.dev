import { relative, resolve, dirname } from "node:path";

export function convertImagePath(imagePath: string, filePath: string): string {
  if (imagePath.startsWith("http")) return imagePath;
  const absoluteImgPath = resolve(dirname(filePath), imagePath);
  const relativePath = relative(process.cwd(), absoluteImgPath);
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
