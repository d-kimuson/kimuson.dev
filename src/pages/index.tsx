import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import { IndexQuery, MarkdownRemarkEdge } from "@graphql-types"
import Sidebar from "../components/templates/sidebar"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import ArticleList from "../components/molecules/article-list"
import { edgeListToArticleList } from "@funcs/article"
// @ts-ignore
import styles from "./index.module.scss"

interface IndexProps extends PageProps {
  data: IndexQuery
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const posts = edgeListToArticleList(edges)

  console.log(
    `nodes: `,
    edges.filter(e => typeof e.node.excerpt !== `string`)
  )

  return (
    <>
      <Head />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">Latest Posts</h1>

                <ArticleList articles={posts} />
                <div className={styles.blogLinkWrapper}>
                  <Link to="/blog/">もっと記事を見る</Link>
                </div>
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default Index

export const pageQuery = graphql`
  query Index {
    allMarkdownRemark(
      filter: { fields: { slug: { regex: "//blog/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
    ) {
      edges {
        node {
          excerpt(truncate: true)
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
                fluid(maxHeight: 90) {
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
