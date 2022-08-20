import { graphql } from "gatsby"
import React from "react"
import type { TagPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { BlogPostList } from "~/components/common/blog-post-list"
import { Head } from "~/components/common/head"
import { Layout } from "~/components/layout"
import { Sidebar } from "~/components/sidebar"
import { toBlogPostList } from "~/service/gateways/post"
import { toTagLink } from "~/service/presenters/links"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const TagPageTemplate: React.FC<TagPageProps> = ({
  data,
  pageContext,
}: TagPageProps) => {
  const blogPosts = toBlogPostList(data.allMdx.edges as PostMdxEdge[])
  const tag = pageContext.tag ?? `No Tag`

  const siteTitle = data.site?.siteMetadata?.title ?? ``

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

export default TagPageTemplate

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
        title
      }
    }
  }
`
