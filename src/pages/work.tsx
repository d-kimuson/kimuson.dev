import React from "react"
import { graphql, PageProps } from "gatsby"

import type { WorkPageQuery, MdxEdge } from "@graphql-types"
import { toWorkPostList } from "~/service/gateways/post"
import { Head } from "~/components/common/head"
import { Sidebar } from "~/components/sidebar"
import { Layout } from "~/components/layout"
import { WorkPostList } from "~/components/common/work-post-list"

interface WorkPageProps extends PageProps {
  data: WorkPageQuery
}

const WorkPage: React.FC<WorkPageProps> = ({ data }: WorkPageProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const workPosts = toWorkPostList(edges)

  return (
    <>
      <Head title={`Works`} description={`開発物を紹介します。`} />
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
      siteMetadata {
        title
      }
    }
  }
`
