import React from "react"
import { graphql, PageProps } from "gatsby"

import type { BlogPageQuery, MdxEdge } from "@graphql-types"
import { convertToBlogPostList } from "@funcs/post"
import { Head } from "@components/templates/head"
import { Layout } from "@components/templates/layout"
import { Sidebar } from "@components/templates/sidebar"
import { Search } from "@components/molecules/search"

interface BlogProps extends PageProps {
  data: BlogPageQuery
}

const BlogPage: React.FC<BlogProps> = ({ data }: BlogProps) => {
  const title = `検索`
  const description = `検索することができます。`

  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main" style={{ width: `100%` }}>
              <section style={{ width: `100%` }}>
                <Search blogPosts={convertToBlogPostList(edges)} />
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default BlogPage

export const pageQuery = graphql`
  query BlogPage {
    allMdx(
      filter: { fields: { slug: { regex: "//blog/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
  }
`
