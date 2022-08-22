import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { WorkPageQuery, MdxEdge } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toWorkPostList } from "~/features/blog/services/post"
import {
  filterDraftPostList,
  sortPostList,
} from "~/features/blog/services/post"
import { Head } from "~/features/seo/components/head"
import { WorkPageContent } from "~/page-contents/work"

type WorkPageProps = PageProps<WorkPageQuery>

const WorkPage: React.FC<WorkPageProps> = ({ data }) => {
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const workPosts = pipe(
    toWorkPostList,
    sortPostList,
    filterDraftPostList
  )(edges as PostMdxEdge[])

  return (
    <React.Fragment>
      <Head title={`Works`} description={`開発物を紹介します。`} />
      <WorkPageContent workPosts={workPosts} />
    </React.Fragment>
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
