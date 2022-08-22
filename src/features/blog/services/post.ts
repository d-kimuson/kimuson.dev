import dayjs from "dayjs"
import { curry } from "ramda"
import type { SiteSiteMetadataPosts } from "@graphql-types"
import type { Dayjs } from "dayjs"
import type { PostMdxEdge, PostMdx } from "types/external-graphql-types"
import type {
  Detail,
  Post,
  BlogPost,
  WorkPost,
  AboutPost,
  FeedPost,
  FeedSiteName,
} from "~/types/post"
import type { Heading, PostTableOfContent } from "~/types/post"
import { excludeNull } from "~/utils"

export const toDetail = curry(
  <T extends Post>(
    f: (param: PostMdx) => T | undefined,
    postUrl: string | undefined,
    mdx: PostMdx
  ): Detail<T> | undefined => {
    const post = f(mdx)

    return post && mdx.body && mdx.tableOfContents
      ? {
          ...post,
          body: mdx.body,
          headings: toHeadings(mdx.tableOfContents.items),
          postUrl: postUrl ? encodeURI(postUrl) : undefined,
          ogtImageUrl: excludeNull(mdx.frontmatter.thumbnail?.publicURL),
        }
      : undefined
  }
)

export const toBlogPost = (mdx: PostMdx): BlogPost | undefined => {
  return mdx.fields?.slug && mdx.frontmatter.category
    ? {
        __typename: `BlogPost`,
        slug: mdx.fields.slug,
        title: mdx.frontmatter.title || `No Title`,
        description: mdx.frontmatter.description ?? `No Description`,
        date: dayjs(mdx.frontmatter.date).locale(`Asia/Tokyo`),
        thumbnail: mdx.frontmatter.thumbnail?.childImageSharp?.gatsbyImageData,
        draft: mdx.frontmatter.draft ?? false,
        category: mdx.frontmatter.category,
        tags: mdx.frontmatter.tags?.map((tag) => String(tag)) ?? [],
      }
    : undefined
}

export const toDetailBlogPost = toDetail(toBlogPost) as (
  postUrl: string | undefined,
  mdx: PostMdx
) => Detail<BlogPost> | undefined

export const toBlogPostList = (mdxs: PostMdxEdge[]): BlogPost[] =>
  mdxs
    .map((edge) => toBlogPost(edge.node))
    .filter(
      (maybeBlogPost): maybeBlogPost is BlogPost =>
        typeof maybeBlogPost !== `undefined`
    )

export const toWorkPost = (mdx: PostMdx): WorkPost | undefined =>
  mdx.fields?.slug
    ? {
        __typename: `WorkPost`,
        slug: mdx.fields.slug,
        title: mdx.frontmatter.title || `No Title`,
        description: mdx.frontmatter.description ?? `No Description`,
        date: dayjs(mdx.frontmatter.date).locale(`Asia/Tokyo`),
        thumbnail: mdx.frontmatter.thumbnail?.childImageSharp?.gatsbyImageData,
        draft: mdx.frontmatter.draft ?? false,
      }
    : undefined

export const toDetailWorkPost = toDetail(toWorkPost) as (
  postUrl: string | undefined,
  mdx: PostMdx
) => Detail<WorkPost> | undefined

export const toWorkPostList = (mdxs: PostMdxEdge[]): WorkPost[] => {
  return mdxs
    .map((edge) => toWorkPost(edge.node))
    .filter(
      (maybeWorkPost): maybeWorkPost is WorkPost =>
        typeof maybeWorkPost !== `undefined`
    )
}

export const toAboutPost = (mdx: PostMdx): AboutPost | undefined =>
  mdx.fields?.slug
    ? {
        __typename: `AboutPost`,
        slug: mdx.fields.slug,
        title: mdx.frontmatter.title || `No Title`,
        description: mdx.frontmatter.description ?? `No Description`,
        date: dayjs(mdx.frontmatter.date).locale(`Asia/Tokyo`),
        thumbnail: undefined,
        draft: mdx.frontmatter.draft ?? false,
      }
    : undefined

export const toDetailAboutPost = toDetail(toAboutPost) as (
  postUrl: string | undefined,
  mdx: PostMdx
) => Detail<AboutPost> | undefined

export const toFeedPost = (post: SiteSiteMetadataPosts): FeedPost | undefined =>
  typeof post.link === `string` &&
  typeof post.title === `string` &&
  typeof post.isoDate === `string` &&
  typeof post.site?.name === `string`
    ? {
        __typename: `FeedPost`,
        slug: post.link,
        title: post.title,
        description: `nothing`,
        date: dayjs(post.isoDate).locale(`Asia/Tokyo`),
        siteName: post.site.name as FeedSiteName,
        thumbnail: undefined,
        draft: false,
      }
    : undefined

export const toFeedPostList = (posts: SiteSiteMetadataPosts[]): FeedPost[] => {
  return posts
    .map((post) => toFeedPost(post))
    .filter(
      (maybeFeedPost): maybeFeedPost is FeedPost =>
        typeof maybeFeedPost !== `undefined`
    )
}

export const toHeadings = (
  tableOfContents: PostTableOfContent[]
): Heading[] => {
  return tableOfContents.reduce(
    (headings: Heading[], t: PostTableOfContent) => {
      headings.push({
        tag: `h2`,
        id: t.url.replace(`#`, ``),
        title: t.title,
      })
      ;(t.items ?? []).forEach((item: PostTableOfContent) => {
        headings.push({
          tag: `h3`,
          id: item.url.replace(`#`, ``),
          title: item.title,
        })
      })

      return headings
    },
    []
  )
}

type Draftable = {
  draft?: boolean
}

export const isDraft = (post: Draftable): boolean => !post.draft

export const filterDraftPostList = <T extends Draftable>(posts: T[]): T[] =>
  posts.filter(
    (post) => isDraft(post) || process.env.NODE_ENV === "development"
  )

export const sortPostList = <T extends { date: Dayjs }>(posts: T[]): T[] =>
  posts.sort((a: T, b: T) => (a.date.isBefore(b.date) ? 1 : -1))

export const postSortKey = (a: Draftable, b: Draftable): number =>
  a.draft && !b.draft ? 1 : !a.draft && b.draft ? -1 : 0

export const sortDraftPostList = <T extends Draftable>(posts: T[]): T[] =>
  posts.sort(postSortKey)

export const processDraftPostList = <T extends Draftable>(posts: T[]): T[] => {
  return process.env.NODE_ENV === "development"
    ? sortDraftPostList(posts)
    : filterDraftPostList(posts)
}
