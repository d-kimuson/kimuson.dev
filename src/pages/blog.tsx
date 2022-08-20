import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { BlogPageQuery, SiteSiteMetadataPosts } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { Head } from "~/components/common/head"
import { Layout } from "~/components/layout"
import { Search } from "~/components/search"
import { toSearchBlogPost } from "~/components/search/searchBlogPost"
import { Sidebar } from "~/components/sidebar"
import type { BlogPost, FeedPost } from "~/service/entities/post"
import { toBlogPostList, toFeedPostList } from "~/service/gateways/post"
import { filterDraftPostList, sortPostList } from "~/service/presenters/post"

type BlogProps = {
  data: BlogPageQuery
} & PageProps

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
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main" style={{ width: `100%` }}>
              <section style={{ width: `100%` }}>
                <Search blogPosts={searchBlogPosts} />
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
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
