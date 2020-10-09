import { Article, FluidImage } from "@declaration"
import { MarkdownRemarkEdge } from "@graphql-types"
import { toArg } from "@funcs/type"

export const filterDraft = (e: MarkdownRemarkEdge): boolean =>
  process.env.NODE_ENV === `development` ||
  (typeof e.node.frontmatter?.draft === `boolean` && !e.node.frontmatter.draft)

function mdEdgeToFluidImage(e: MarkdownRemarkEdge): FluidImage | undefined {
  return toArg(e.node.frontmatter?.thumbnail?.childImageSharp?.fluid)
}

export const edgeListToArticleList = (
  edges: MarkdownRemarkEdge[]
): Article[] => {
  return edges
    .filter(filterDraft)
    .map(e => ({
      slug: e.node.fields?.slug,
      title: e.node.frontmatter?.title || `No Title`,
      description: e.node.frontmatter?.description || e.node.excerpt || ``,
      date: e.node.frontmatter?.date,
      thumbnail: mdEdgeToFluidImage(e),
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
}
