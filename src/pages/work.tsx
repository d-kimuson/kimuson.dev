import React from "react"
import { graphql, PageProps } from "gatsby"

import type { WorkPageQuery, MdxEdge } from "@graphql-types"
import Sidebar from "@components/templates/sidebar"
import Layout from "@components/templates/layout"
import Head from "@components/templates/head"
import WorkPostList from "@components/molecules/work-post-list"
import { convertToWorkPostList } from "@funcs/post"

interface WorkPageProps extends PageProps {
  data: WorkPageQuery
}

const WorkPage: React.FC<WorkPageProps> = ({ data }: WorkPageProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const workPosts = convertToWorkPostList(edges)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">Works</h1>

                <WorkPostList workPosts={workPosts} />
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default WorkPage

export const pageQuery = graphql`
  query WorkPage {
    allMdx(
      filter: { fields: { slug: { regex: "//work/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
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
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 200, traceSVG: { background: "#333846" }) {
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
