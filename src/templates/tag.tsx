import { graphql } from "gatsby"
import React from "react"
import type { TagPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toBlogPostList } from "~/features/blog/services/post"
import { Head } from "~/features/seo/components/head"
import { TagPageContent } from "~/page-contents/tag"
import { toTagLink } from "~/service/links"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const TagPageTemplate: React.FC<TagPageProps> = ({
  data,
  pageContext,
}: TagPageProps) => {
  const blogPosts = toBlogPostList(data.allMdx.edges as PostMdxEdge[])
  const tag = pageContext.tag ?? `No Tag`

  const siteTitle = data.site?.siteMetadata?.title ?? ``

  return (
    <React.Fragment>
      <Head
        title={`${tag}タグ`}
        description={`${siteTitle}の${tag}タグページです。｢${tag}｣に関連する記事を探すことができます。`}
        slug={toTagLink(tag)}
      />
      <TagPageContent tag={tag} blogPosts={blogPosts} />
    </React.Fragment>
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
