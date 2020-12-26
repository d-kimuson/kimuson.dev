import React from "react"
import { graphql, PageProps } from "gatsby"

import type { TagPageQuery, MdxEdge } from "@graphql-types"
import { toBlogPostList } from "@gateways/post"
import { toTagLink } from "@presenters/links"
import { Sidebar } from "@components/templates/sidebar"
import { Layout } from "@components/templates/layout"
import { Head } from "@components/templates/head"
import { BlogPostList } from "@components/molecules/blog-post-list"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const BlogPostTemplate: React.FC<TagPageProps> = ({
  data,
  pageContext,
}: TagPageProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const blogPosts = toBlogPostList(edges)
  const tag = pageContext.tag || `No Tag`

  const siteTitle = data.site?.siteMetadata?.title || ``

  return (
    <>
      <Head
        title={`${tag}タグ`}
        description={`${siteTitle}の${tag}タグページです。｢${tag}｣に関連する記事を探すことができます。`}
        slug={toTagLink(tag)}
      />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">タグ: {tag}</h1>
                <BlogPostList blogPosts={blogPosts} />
              </section>
            </main>
          </div>

          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query TagPage($tag: String!) {
    allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            category
            draft
            description
            date
            title
            tags
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 200, traceSVG: { background: "#333846" }) {
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
        title
      }
    }
  }
`
