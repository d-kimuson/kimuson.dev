import React from "react"
import { graphql, PageProps } from "gatsby"

import { TagPageQuery, MarkdownRemarkEdge } from "@graphql-types"
import Sidebar from "../components/templates/sidebar"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import ArticleList from "../components/molecules/article-list"
import { edgeListToArticleList } from "@funcs/article"
import { getTagLink } from "@funcs/links"

type TagPageProps = PageProps<TagPageQuery, { tag?: string }>

const BlogPostTemplate: React.FC<TagPageProps> = ({
  data,
  pageContext,
}: TagPageProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const posts = edgeListToArticleList(edges)
  const tag = pageContext.tag || `No Tag`

  const siteTitle = data.site?.siteMetadata?.title || ``

  return (
    <>
      <Head
        title={`${tag}タグ`}
        description={`${siteTitle}の${tag}タグページです。｢${tag}｣に関連する記事を探すことができます。`}
        slug={getTagLink(tag)}
      />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">タグ: {tag}</h1>
                <ArticleList articles={posts} />
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
    allMarkdownRemark(
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
                fluid(maxHeight: 200) {
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
