import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { IndexQuery, SiteSiteMetadataPosts } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge } from "types/external-graphql-types"
import { toBlogPostList, toFeedPostList } from "~/features/blog/services/post"
import {
  filterDraftPostList,
  sortPostList,
} from "~/features/blog/services/post"
import { Head } from "~/features/seo/components/head"
import { IndexPageContent } from "~/page-contents/index"
import type { BlogPost } from "~/types/post"

type IndexProps = {
  data: IndexQuery
} & PageProps

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const feedPosts = toFeedPostList(
    (data.site?.siteMetadata?.posts ?? []).filter(
      (maybePost): maybePost is SiteSiteMetadataPosts => Boolean(maybePost)
    )
  )

  const blogPosts = pipe(
    toBlogPostList,
    (blogPosts: BlogPost[]) => [...blogPosts, ...feedPosts],
    filterDraftPostList,
    sortPostList
  )(data.allMdx.edges as PostMdxEdge[]).slice(0, 5)

  return (
    <React.Fragment>
      <Head />
      <IndexPageContent blogPosts={blogPosts} />
    </React.Fragment>
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
                gatsbyImageData(
                  height: 90
                  width: 120
                  layout: FULL_WIDTH
                  formats: [AUTO, WEBP, AVIF]
                  placeholder: TRACED_SVG
                )
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
        posts {
          isoDate
          link
          title
          site {
            feedUrl
            name
          }
        }
      }
    }
  }
`
