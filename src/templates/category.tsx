import React from "react"
import { graphql, PageProps } from "gatsby"

import { CategoryPageQuery, MdxEdge } from "@graphql-types"
import Sidebar from "@components/templates/sidebar"
import Layout from "@components/templates/layout"
import Head from "@components/templates/head"
import BlogPostList from "@components/molecules/blog-post-list"
import { convertToBlogPostList } from "@funcs/post"
import { getCategoryLink } from "@funcs/links"

type CategoryPageProps = PageProps<CategoryPageQuery, { category?: string }>

const BlogPostTemplate: React.FC<CategoryPageProps> = ({
  data,
  pageContext,
}: CategoryPageProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const blogPosts = convertToBlogPostList(edges)
  const category = pageContext.category || `No Category`
  const siteTitle = data.site?.siteMetadata?.title || ``

  return (
    <>
      <Head
        title={`${category}カテゴリ`}
        description={`${siteTitle}の${category}カテゴリページです。${category}カテゴリの記事を探すことができます。`}
        slug={getCategoryLink(category)}
      />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">カテゴリ: {category}</h1>

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
  query CategoryPage($category: String!) {
    allMdx(
      filter: { frontmatter: { category: { eq: $category } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          slug
          frontmatter {
            category
            draft
            description
            date
            title
            tags
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 200) {
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
