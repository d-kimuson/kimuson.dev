import React from "react"
import { graphql, PageProps } from "gatsby"

import { BlogPageQuery, MarkdownRemarkEdge } from "@graphql-types"
import Sidebar from "../components/templates/sidebar"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import ArticleList from "../components/molecules/article-list"
import { edgeListToArticleList } from "@funcs/article"

interface BlogPageProps extends PageProps {
  data: BlogPageQuery
}

const BlogPage: React.FC<BlogPageProps> = ({ data }: BlogPageProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const posts = edgeListToArticleList(edges)

  console.log(data)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-wrapper">
          <main role="main">
            <section>
              <h1 className="m-page-title">Latest Posts</h1>

              <ArticleList articles={posts} />
            </section>
          </main>
        </div>
        <Sidebar bio={true} commonSidebar={true} />
      </Layout>
    </>
  )
}

export default BlogPage

export const pageQuery = graphql`
  query BlogPage {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            draft
            category
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
      id
      siteMetadata {
        title
      }
    }
  }
`