import React from "react"
import { graphql, PageProps } from "gatsby"

import { CategoryPageQuery, MarkdownRemarkEdge } from "../../types/graphql-types"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Head from "../components/head"
import ArticleList from "../components/article-list"
import { edgeListToArticleList } from "../utils/article"

type CategoryPageProps = PageProps<CategoryPageQuery, { category?: string }>

const BlogPostTemplate: React.FC<CategoryPageProps> = (
  { data, pageContext }: CategoryPageProps
) => {
  const edges = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
  const posts = edgeListToArticleList(edges)
  const category = pageContext.category || `No Category`

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-container">
          <main role="main">
            <section>
              <h1>カテゴリ: { category }</h1>
              <ArticleList articles={posts} />
            </section>
          </main>
        </div>
        <div className="l-sidebar-container">
          <p>さいどばー</p>
          <Bio />
        </div>
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query CategoryPage($category: String!) {
    allMarkdownRemark(filter: {frontmatter: {category: { eq: $category }}}) {
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
                fluid(maxWidth: 590) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
