import z from "zod";
import type { ArticleCommon } from "~/article/article-common";

export type ExternalArticle = ArticleCommon & {
  kind: "external";
};

export const externalArticleSchema = z
  .object({
    title: z.string(),
    siteName: z.literal("Mobile Factory Tech Blog"),
    url: z.string(),
    image: z.string(),
    description: z.string(),
    date: z.string(),
  })
  .transform(
    ({ date, image, url, ...others }): ExternalArticle => ({
      ...others,
      kind: "external",
      thumbnail: image,
      fullUrl: url,
      date: new Date(Number.parseInt(date) * 1000),
    })
  );
