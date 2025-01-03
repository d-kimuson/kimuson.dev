import * as v from 'valibot'

export const articleSchema = v.object({
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.string(), "まだ書かれていません。"),
  tags: v.array(v.string()),
  content: v.string(),
  date: v.pipe(v.string(), v.transform(date => new Date(date))),
  thumbnail: v.optional(v.string()),
  draft: v.boolean(),
})

export type Article = v.InferOutput<typeof articleSchema>

export const externalArticleSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  url: v.string(),
  date: v.pipe(v.string(), v.transform(date => new Date(date))),
})

export type ExternalArticle = v.InferOutput<typeof externalArticleSchema>

export interface Contents {
  internalArticles: ReadonlyArray<Article>
  externalArticles: {
    zenn: ReadonlyArray<ExternalArticle>
  }
}
