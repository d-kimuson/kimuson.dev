import type { BlogPost, WorkPost, FluidImage } from "@declaration"
import type { MdxEdge } from "@graphql-types"
import { toUndefinedOrT } from "@funcs/type"

interface DraftablePost {
  draft: boolean
}

export const filterDraft = (post: DraftablePost): boolean => !post.draft

export const filterDraftPostList = <T extends DraftablePost>(posts: T[]): T[] =>
  posts.filter(filterDraft)

export const sortDraft = (a: DraftablePost, b: DraftablePost): number =>
  a.draft && !b.draft ? 1 : !a.draft && b.draft ? -1 : 0

export const sortDraftPostList = <T extends DraftablePost>(posts: T[]): T[] =>
  posts.sort(sortDraft)

export const processDraftPostList = <T extends DraftablePost>(
  posts: T[]
): T[] => {
  return process.env.NODE_ENV === `development`
    ? sortDraftPostList(posts)
    : filterDraftPostList(posts)
}

export function getFluidImage(e: MdxEdge): FluidImage | undefined {
  return toUndefinedOrT(e.node.frontmatter?.thumbnail?.childImageSharp?.fluid)
}

export const convertToBlogPostList = (edges: MdxEdge[]): BlogPost[] => {
  // MdxEdge から BlogPostList を取り出す
  //  - development 環境 => 非公開記事を下に並べる
  //  - production  環境 => 非公開記事を取り除く
  return processDraftPostList(
    edges
      .map(e => ({
        slug: e.node.fields?.slug,
        title: e.node.frontmatter?.title || `No Title`,
        description:
          e.node.frontmatter?.description || e.node.excerpt || `No Description`,
        date: e.node.frontmatter?.date,
        thumbnail: getFluidImage(e),
        draft: e.node.frontmatter?.draft || false,
        category: e.node.frontmatter?.category,
        tags: e.node.frontmatter?.tags?.map(tag => String(tag)) || [],
      }))
      .filter(
        (post): post is BlogPost =>
          typeof post.slug === `string` &&
          typeof post.date === `string` &&
          typeof post.category === `string`
      )
  )
}

export const convertToWorkPostList = (edges: MdxEdge[]): WorkPost[] => {
  // MdxEdge から BlogPostList を取り出す
  //  - development 環境 => 非公開記事を下に並べる
  //  - production  環境 => 非公開記事を取り除く
  return processDraftPostList(
    edges
      .map(e => ({
        slug: e.node.fields?.slug,
        title: e.node.frontmatter?.title || `No Title`,
        description:
          e.node.frontmatter?.description || e.node.excerpt || `No Description`,
        date: e.node.frontmatter?.date,
        thumbnail: getFluidImage(e),
        draft: e.node.frontmatter?.draft || false,
      }))
      .filter(
        (post): post is WorkPost =>
          typeof post.slug === `string` && typeof post.date === `string`
      )
  )
}
