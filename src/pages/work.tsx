import React from "react"
import { graphql, PageProps } from "gatsby"

import { WorkPageQuery, MarkdownRemarkEdge } from "@graphql-types"
import Sidebar from "../components/templates/sidebar"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import WorkList from "../components/molecules/work-list"
import { edgeListToWorkList } from "@funcs/article"

interface WorkPageProps extends PageProps {
  data: WorkPageQuery
}

const WorkPage: React.FC<WorkPageProps> = ({ data }: WorkPageProps) => {
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const works = edgeListToWorkList(edges)

  return (
    <>
      <Head />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">Works</h1>

                <WorkList works={works} />
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
    allMarkdownRemark(
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
