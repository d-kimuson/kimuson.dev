import { object, string, literal, transform } from "valibot";
import type { ArticleCommon } from "~/domain-object/article/article-common";

export type ExternalArticle = ArticleCommon & {
  kind: "external";
};

export const externalArticleSchema = transform(
  object({
    title: string(),
    siteName: literal("Mobile Factory Tech Blog"),
    url: string(),
    image: string(),
    description: string(),
    date: string(),
  }),
  ({ date, image, url, ...others }): ExternalArticle => ({
    ...others,
    kind: "external",
    thumbnail: image,
    linkUrl: url,
    fullUrl: url,
    date: new Date(Number.parseInt(date) * 1000),
  })
);
