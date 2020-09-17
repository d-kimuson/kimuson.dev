import React from "react"
import { graphql, PageProps } from "gatsby"

import { IndexQuery, MarkdownRemarkEdge } from "@graphql-types"
import Bio from "../components/sidebar/bio"
import CommonSidebar from "../components/sidebar/common-sidebar"
import Layout from "../components/layout"
import Head from "../components/head"
import ArticleList from "../components/article-list"
import { edgeListToArticleList } from "../utils/article"

interface IndexProps extends PageProps {
  data: IndexQuery
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const posts = edgeListToArticleList(edges)
  const title = data.site?.siteMetadata?.title || `No Title`

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-container">
          <main role="main">
            <section>
              <h1 className="m-page-title">{title}</h1>

              <ArticleList articles={posts} />
            </section>
          </main>
        </div>
        <div className="l-sidebar-container">
          <p>さいどばー</p>
          <Bio />
          <CommonSidebar />
        </div>
      </Layout>
    </>
  )
}

export default Index

export const pageQuery = graphql`
  query Index {
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
            date(formatString: "MMMM DD, YYYY")
            draft
            category
            tags
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 300) {
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
