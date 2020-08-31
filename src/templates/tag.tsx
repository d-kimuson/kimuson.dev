import React from "react"
import { graphql, PageProps } from "gatsby"

import { TagPageQuery, MarkdownRemarkEdge } from "../../types/graphql-types"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Head from "../components/head"
import ArticleList from "../components/article-list"
import { edgeListToArticleList } from "../utils/article"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const BlogPostTemplate: React.FC<TagPageProps> = (
  { data, pageContext }: TagPageProps
) => {
  const edges = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
  const posts = edgeListToArticleList(edges)
  const tag = pageContext.tag || `No Tag`

  console.log(posts)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-container">
          <main role="main">
            <section>
              <h1>タグ: { tag }</h1>
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
  query TagPage($tag: String!) {
    allMarkdownRemark(filter: {frontmatter: {tags: { in: [$tag] }}}) {
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
