import type { InternalArticle } from "~/domain-object/article/internal-article"
import { buildInternalArticle } from "~/domain-object/article/internal-article"
import type { Heading } from "~/domain-object/heading"

export type InternalArticleDetail = InternalArticle & {
  headings: Heading[]
}

export const buildInternalArticleDetail = (
  frontmatter: Record<string, unknown>,
  url: string,
  headings: Heading[]
): InternalArticleDetail => {
  const internalArticle = buildInternalArticle(frontmatter, url)

  return {
    ...internalArticle,
    headings,
  }
}
