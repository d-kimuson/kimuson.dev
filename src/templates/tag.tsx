import React from "react"
import { graphql, PageProps } from "gatsby"

import type { TagPageQuery } from "@graphql-types"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toBlogPostList } from "~/service/gateways/post"
import { toTagLink } from "~/service/presenters/links"
import { Sidebar } from "~/components/sidebar"
import { Layout } from "~/components/layout"
import { Head } from "~/components/common/head"
import { BlogPostList } from "~/components/common/blog-post-list"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const TagPageTemplate: React.VFC<TagPageProps> = ({
  data,
  pageContext,
}: TagPageProps) => {
  const blogPosts = toBlogPostList(data.allMdx.edges as PostMdxEdge[])
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
                  layout: FIXED
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
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
