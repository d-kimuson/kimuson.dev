import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { BlogPageQuery, SiteSiteMetadataPosts } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toSearchBlogPost } from "~/features/blog-search/components/search/searchBlogPost"
import { toBlogPostList, toFeedPostList } from "~/features/blog/services/post"
import {
  filterDraftPostList,
  sortPostList,
} from "~/features/blog/services/post"
import { Head } from "~/features/seo/components/head"
import { BlogPageContent } from "~/page-contents/blog"
import type { BlogPost, FeedPost } from "~/types/post"

type BlogProps = PageProps<BlogPageQuery>

const BlogPage: React.FC<BlogProps> = ({ data }: BlogProps) => {
  const title = `ブログ`
  const description = `記事の一覧を確認できます。タグやタイトルから記事を検索することができます。`

  const feedPosts = toFeedPostList(
    (data.site?.siteMetadata?.posts ?? []).filter(
      (maybePost): maybePost is SiteSiteMetadataPosts => Boolean(maybePost)
    )
  )

  const searchBlogPosts = pipe(
    toBlogPostList,
    (blogPosts: BlogPost[]) => [...blogPosts, ...feedPosts],
    (blogPosts: (BlogPost | FeedPost)[]) => blogPosts.map(toSearchBlogPost),
    filterDraftPostList,
    sortPostList
  )(data.allMdx.edges as PostMdxEdge[])

  return (
    <>
      <Head title={title} description={description} />
      <BlogPageContent searchBlogPosts={searchBlogPosts} />
    </>
  )
}

export default BlogPage

export const pageQuery = graphql`
  query BlogPage {
    allMdx(
      filter: { fields: { slug: { regex: "//blog/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            draft
            category
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  height: 90
                  width: 120
                  layout: FULL_WIDTH
                  formats: [AUTO, WEBP, AVIF]
                  placeholder: TRACED_SVG
                )
              }
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        posts {
          isoDate
          link
          title
          site {
            feedUrl
            name
          }
        }
      }
    }
  }
`
