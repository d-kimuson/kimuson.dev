import { graphql } from "gatsby"
import React from "react"
import type { WorkPostBySlugQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdx } from "types/external-graphql-types"
import type { AroundNav } from "types/external-graphql-types"
import { toDetailWorkPost } from "~/features/blog/services/post"
import { WorkPostPageContent } from "~/page-contents/work-post"
import { toWorkPostLink } from "~/service/links"

type WorkPostTemplateProps = PageProps<
  WorkPostBySlugQuery,
  {
    previous: AroundNav | null
    next: AroundNav | null
  }
>

const WorkPostTemplate: React.FC<WorkPostTemplateProps> = ({
  data,
}: WorkPostTemplateProps) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const siteUrl = data.site?.siteMetadata?.siteUrl ?? `http://127.0.0.1`
  const postUrl = siteUrl + toWorkPostLink(mdx.fields?.slug ?? ``)

  const post = toDetailWorkPost(postUrl, mdx as PostMdx)

  if (post === undefined) {
    throw new Error()
  }

  return <WorkPostPageContent post={post} />
}

export default WorkPostTemplate

export const pageQuery = graphql`
  query WorkPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      tableOfContents
      fields {
        slug
      }
      frontmatter {
        title
        date
        description
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
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
