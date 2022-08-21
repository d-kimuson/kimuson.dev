import { graphql } from "gatsby"
import React from "react"
import type { CategoryPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toBlogPostList } from "~/features/blog/services/post"
import { Head } from "~/features/seo/components/head"
import { CategoryPageContent } from "~/page-contents/category"
import { toCategoryLink } from "~/service/links"

type CategoryPageProps = PageProps<CategoryPageQuery, { category?: string }>

const BlogPostTemplate: React.FC<CategoryPageProps> = ({
  data,
  pageContext,
}: CategoryPageProps) => {
  const blogPosts = toBlogPostList(data.allMdx.edges as PostMdxEdge[])
  const category = pageContext.category ?? "No Category"
  const siteTitle = data.site?.siteMetadata?.title ?? ""

  return (
    <React.Fragment>
      <Head
        title={`${category}カテゴリ`}
        description={`${siteTitle}の${category}カテゴリページです。${category}カテゴリの記事を探すことができます。`}
        slug={toCategoryLink(category)}
      />
      <CategoryPageContent category={category} blogPosts={blogPosts} />
    </React.Fragment>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query CategoryPage($category: String!) {
    allMdx(
      filter: { frontmatter: { category: { eq: $category } } }
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
