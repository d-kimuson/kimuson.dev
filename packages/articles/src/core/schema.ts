import * as v from "valibot";

export const articleSchema = v.object({
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.string(), "まだ書かれていません。"),
  tags: v.array(v.string()),
  date: v.pipe(
    v.string(),
    v.transform((date) => new Date(date))
  ),
  thumbnail: v.optional(v.string()),
  draft: v.boolean(),
});

export const articleDetailSchema = v.intersect([
  articleSchema,
  v.object({
    content: v.string(),
  }),
]);

export const externalArticleSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  url: v.string(),
  date: v.pipe(
    v.string(),
    v.transform((date) => new Date(date))
  ),
  tags: v.array(v.string()),
});

export const contentsSchema = v.object({
  internalArticles: v.array(articleDetailSchema),
  externalArticles: v.array(
    v.object({
      group: v.string(),
      articles: v.array(externalArticleSchema),
    })
  ),
});
