import { curry } from "ramda"
import dayjs from "dayjs"

import type {
  MdxEdge,
  Mdx,
  MdxFrontmatter,
  MdxFields,
  Maybe,
  File,
  SiteSiteMetadataPosts,
} from "@graphql-types"
import type {
  Detail,
  Post,
  BlogPost,
  WorkPost,
  AboutPost,
  FeedPost,
  FeedSiteName,
} from "~/service/entities/post"
import type { RawFluidImage } from "~/service/entities/image"
import { toFluidImage } from "~/service/gateways/image"
import { toHeadings } from "~/service/gateways/heading"
import { excludeNull } from "~/utils"

type PostMdx = Pick<Mdx, "tableOfContents" | "body"> &
  Maybe<{
    fields?: Maybe<Pick<MdxFields, "slug">>
    frontmatter: Pick<
      MdxFrontmatter,
      "category" | "title" | "tags" | "draft" | "description" | "date"
    > & {
      thumbnail?: Maybe<
        Pick<File, "publicURL"> & {
          childImageSharp?: Maybe<{
            fluid?: Maybe<RawFluidImage>
          }>
        }
      >
    }
  }>

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
          headings: toHeadings(mdx.tableOfContents),
          postUrl,
          ogtImageUrl: excludeNull(mdx.frontmatter?.thumbnail?.publicURL),
        }
      : undefined
  }
)

export const toBlogPost = (mdx: PostMdx): BlogPost | undefined => {
  return mdx.fields?.slug && mdx.frontmatter?.category
    ? {
        __typename: `BlogPost`,
        slug: mdx.fields?.slug,
        title: mdx.frontmatter?.title || `No Title`,
        description: mdx.frontmatter?.description || `No Description`,
        date: dayjs(mdx.frontmatter?.date).locale(`Asia/Tokyo`),
        thumbnail: toFluidImage(
          mdx.frontmatter?.thumbnail?.childImageSharp?.fluid
        ),
        draft: mdx.frontmatter?.draft || false,
        category: mdx.frontmatter?.category,
        tags: mdx.frontmatter?.tags?.map((tag) => String(tag)) || [],
      }
    : undefined
}

export const toDetailBlogPost = toDetail(toBlogPost) as (
  postUrl: string | undefined,
  mdx: PostMdx
) => Detail<BlogPost> | undefined

export const toBlogPostList = (mdxs: MdxEdge[]): BlogPost[] =>
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
        slug: mdx.fields?.slug,
        title: mdx.frontmatter?.title || `No Title`,
        description: mdx.frontmatter?.description || `No Description`,
        date: dayjs(mdx.frontmatter?.date).locale(`Asia/Tokyo`),
        thumbnail: toFluidImage(
          mdx.frontmatter?.thumbnail?.childImageSharp?.fluid
        ),
        draft: mdx.frontmatter?.draft || false,
      }
    : undefined

export const toDetailWorkPost = toDetail(toWorkPost) as (
  postUrl: string | undefined,
  mdx: PostMdx
) => Detail<WorkPost> | undefined

export const toWorkPostList = (mdxs: MdxEdge[]): WorkPost[] => {
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
        slug: mdx.fields?.slug,
        title: mdx.frontmatter?.title || `No Title`,
        description: mdx.frontmatter?.description || `No Description`,
        date: dayjs(mdx.frontmatter?.date).locale(`Asia/Tokyo`),
        thumbnail: undefined,
        draft: mdx.frontmatter?.draft || false,
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
        siteName: post.site?.name as FeedSiteName,
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
