import matter from "gray-matter";
import fs from "fs-extra";
import * as v from "valibot";
import { convertImagePath, getSlugFromPath } from "../path";
import { Article, ArticleDetail } from "../../../core/types";
import { articleDetailSchema, articleSchema } from "../../../core/schema";

export async function processMarkdownFile(
  filePath: string
): Promise<ArticleDetail> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // 画像パスの変換
  const processedContent = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imgPath) => {
      const newPath = convertImagePath(imgPath, filePath);
      return `![${alt}](${newPath})`;
    }
  );

  const articleData = {
    slug: getSlugFromPath(filePath),
    title: data["title"],
    description: data["description"] || "まだ書かれていません",
    tags: data["tags"] || [],
    content: processedContent,
    date: data["date"],
    thumbnail: data["thumbnail"],
    draft: data["draft"],
  };

  console.log(`Processing ${filePath}:`);

  const result = v.safeParse(articleDetailSchema, articleData);

  if (!result.success) {
    throw new Error(
      `Validation failed for ${filePath}. Required fields: title, description, tags, content, date`
    );
  }

  return result.output;
}
