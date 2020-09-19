import React from "react"
import { graphql, PageProps } from "gatsby"

import { CategoryPageQuery, MarkdownRemarkEdge } from "@graphql-types"
import Bio from "../components/sidebar/bio"
import CommonSidebar from "../components/sidebar/common-sidebar"
import Layout from "../components/layout"
import Head from "../components/head"
import ArticleList from "../components/article-list"
import { edgeListToArticleList } from "../utils/article"

type CategoryPageProps = PageProps<CategoryPageQuery, { category?: string }>

const BlogPostTemplate: React.FC<CategoryPageProps> = ({
  data,
  pageContext,
}: CategoryPageProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const posts = edgeListToArticleList(edges)
  const category = pageContext.category || `No Category`
  const siteTitle = data.site?.siteMetadata?.title || ``

  return (
    <>
      <Head
        title={`${category}カテゴリ`}
        description={`${siteTitle}の${category}カテゴリページです。${category}カテゴリの記事を探すことができます。`}
        slug={`/categories/${category}/`}
      />
      <Layout>
        <div className="l-main-wrapper">
          <main role="main">
            <section>
              <h1 className="m-page-title">カテゴリ: {category}</h1>
              <ArticleList articles={posts} />
            </section>
          </main>
        </div>
        <div className="l-sidebar-container">
          <Bio />
          <CommonSidebar />
        </div>
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query CategoryPage($category: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { category: { eq: $category } } }
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
            date(formatString: "YYYY年MM月DD日")
            title
            tags
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 590) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
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
