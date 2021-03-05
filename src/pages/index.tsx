import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import { pipe } from "ramda"

import type { IndexQuery, MdxEdge, SiteSiteMetadataPosts } from "@graphql-types"
import type { BlogPost } from "~/service/entities/post"
import { toBlogPostList, toFeedPostList } from "~/service/gateways/post"
import { filterDraftPostList, sortPostList } from "~/service/presenters/post"
import { Head } from "~/components/common/head"
import { Sidebar } from "~/components/sidebar"
import { Layout } from "~/components/layout"
import { BlogPostList } from "~/components/common/blog-post-list"
import * as styles from "./index.module.scss"

interface IndexProps extends PageProps {
  data: IndexQuery
}

const Index: React.VFC<IndexProps> = ({ data }: IndexProps) => {
  const feedPosts = toFeedPostList(
    (
      data.site?.siteMetadata?.posts || []
    ).filter((maybePost): maybePost is SiteSiteMetadataPosts =>
      Boolean(maybePost)
    )
  )

  const blogPosts = pipe(
    (edges: IndexQuery["allMdx"]["edges"]) =>
      edges.filter((e): e is MdxEdge => typeof e !== `undefined`),
    toBlogPostList,
    (blogPosts: BlogPost[]) => [...blogPosts, ...feedPosts],
    filterDraftPostList,
    sortPostList
  )(data.allMdx.edges).slice(0, 5)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">最近の投稿</h1>

                <BlogPostList blogPosts={blogPosts} />
                <div className={styles.blogLinkWrapper}>
                  <Link to="/blog/">もっと記事を見る</Link>
                </div>
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default Index

export const pageQuery = graphql`
  query Index {
    allMdx(
      filter: { fields: { slug: { regex: "//blog/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
    ) {
      edges {
        node {
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
      id
      siteMetadata {
        title
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
