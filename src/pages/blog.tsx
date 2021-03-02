import React from "react"
import { graphql, PageProps } from "gatsby"
import { pipe } from "ramda"

import type {
  BlogPageQuery,
  MdxEdge,
  SiteSiteMetadataPosts,
} from "@graphql-types"
import type { BlogPost, FeedPost } from "~/_entities/post"
import { toBlogPostList, toFeedPostList } from "~/_gateways/post"
import { toSearchBlogPost } from "~/_usecases/searchBlogPost"
import { filterDraftPostList, sortPostList } from "~/_presenters/post"
import { Head } from "~/components/templates/head"
import { Layout } from "~/components/templates/layout"
import { Sidebar } from "~/components/templates/sidebar"
import { Search } from "~/components/molecules/search"

interface BlogProps extends PageProps {
  data: BlogPageQuery
}

const BlogPage: React.FC<BlogProps> = ({ data }: BlogProps) => {
  const title = `ブログ`
  const description = `記事の一覧を確認できます。タグやタイトルから記事を検索することができます。`

  const feedPosts = toFeedPostList(
    (
      data.site?.siteMetadata?.posts || []
    ).filter((maybePost): maybePost is SiteSiteMetadataPosts =>
      Boolean(maybePost)
    )
  )

  const searchBlogPosts = pipe(
    (edges: BlogPageQuery["allMdx"]["edges"]) =>
      edges.filter((e): e is MdxEdge => typeof e !== `undefined`),
    toBlogPostList,
    (blogPosts: BlogPost[]) => [...blogPosts, ...feedPosts],
    (blogPosts: (BlogPost | FeedPost)[]) => blogPosts.map(toSearchBlogPost),
    filterDraftPostList,
    sortPostList
  )(data.allMdx.edges)

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
                fluid(maxHeight: 90, traceSVG: { background: "#333846" }) {
                  aspectRatio
                  base64
                  sizes
                  src
                  srcSet
                  srcWebp
                  srcSetWebp
                  tracedSVG
                }
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
