import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { IndexQuery, SiteSiteMetadataPosts } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { BlogPostList } from "~/features/blog/components/blog-post-list"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { Head } from "~/features/seo/components/head"
import { Link } from "~/functional/mdx/link"
import type { BlogPost } from "~/service/entities/post"
import { toBlogPostList, toFeedPostList } from "~/service/gateways/post"
import { filterDraftPostList, sortPostList } from "~/service/presenters/post"
import * as styles from "./index.module.scss"

type IndexProps = {
  data: IndexQuery
} & PageProps

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const feedPosts = toFeedPostList(
    (data.site?.siteMetadata?.posts ?? []).filter(
      (maybePost): maybePost is SiteSiteMetadataPosts => Boolean(maybePost)
    )
  )

  const blogPosts = pipe(
    toBlogPostList,
    (blogPosts: BlogPost[]) => [...blogPosts, ...feedPosts],
    filterDraftPostList,
    sortPostList
  )(data.allMdx.edges as PostMdxEdge[]).slice(0, 5)

  return (
    <>
      <Head />
      <CommonLayout>
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
      </CommonLayout>
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
