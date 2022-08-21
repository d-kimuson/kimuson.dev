import { graphql } from "gatsby"
import React from "react"
import type { TagPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { BlogPostList } from "~/features/blog/components/blog-post-list"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { Head } from "~/features/seo/components/head"
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
      <CommonLayout>
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
      </CommonLayout>
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
