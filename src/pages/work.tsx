import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { WorkPageQuery, MdxEdge } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { Head } from "~/components/common/head"
import { WorkPostList } from "~/components/common/work-post-list"
import { Layout } from "~/components/layout"
import { Sidebar } from "~/components/sidebar"
import { toWorkPostList } from "~/service/gateways/post"
import { filterDraftPostList, sortPostList } from "~/service/presenters/post"

type WorkPageProps = {
  data: WorkPageQuery
} & PageProps

const WorkPage: React.FC<WorkPageProps> = ({ data }: WorkPageProps) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const workPosts = pipe(
    toWorkPostList,
    sortPostList,
    filterDraftPostList
  )(edges as PostMdxEdge[])

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
                gatsbyImageData(
                  layout: FULL_WIDTH
                  placeholder: TRACED_SVG
                  formats: [AUTO, WEBP, AVIF]
                )
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
