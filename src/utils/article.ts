import { Article } from "../../types/declaration"
import { MarkdownRemarkEdge } from "../../types/graphql-types"

export const filterDraft = (e: MarkdownRemarkEdge): boolean =>
  process.env.NODE_ENV === `development` ||
  (typeof e.node.frontmatter?.draft === `boolean` && !e.node.frontmatter.draft)

export const edgeListToArticleList = (edges: MarkdownRemarkEdge[]): Article[] =>
  edges
    .filter(filterDraft)
    .map(e => ({
      slug: e.node.fields?.slug,
      title: e.node.frontmatter?.title || `No Title`,
      description: e.node.frontmatter?.description || e.node.excerpt || ``,
      date: e.node.frontmatter?.date,
      thumbnail: e.node.frontmatter?.thumbnail?.childImageSharp?.fluid,
      draft: e.node.frontmatter?.draft || false,
      category: e.node.frontmatter?.category,
      tags: e.node.frontmatter?.tags?.map(tag => String(tag)) || [],
    }))
    .filter(
      (post): post is Article =>
        typeof post.slug === `string` &&
        typeof post.date === `string` &&
        typeof post.category === `string`
    )
