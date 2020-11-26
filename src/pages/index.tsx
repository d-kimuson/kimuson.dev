import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import type { IndexQuery, MdxEdge } from "@graphql-types"
import { Sidebar } from "@components/templates/sidebar"
import { Layout } from "@components/templates/layout"
import { Head } from "@components/templates/head"
import { BlogPostList } from "@components/molecules/blog-post-list"
import { convertToBlogPostList } from "@funcs/post"
// @ts-ignore
import styles from "./index.module.scss"

interface IndexProps extends PageProps {
  data: IndexQuery
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const blogPosts = convertToBlogPostList(edges)

  console.log(edges)
  console.log(blogPosts)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">Latest Posts</h1>

                <BlogPostList blogPosts={blogPosts} />
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
    allMdx(
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
                fluid(maxHeight: 90, traceSVG: { background: "#333846" }) {
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
      id
      siteMetadata {
        title
      }
    }
  }
`
