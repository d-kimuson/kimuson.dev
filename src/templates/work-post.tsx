import { graphql } from "gatsby"
import React from "react"
import type { WorkPostBySlugQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdx } from "types/external-graphql-types"
import type { AroundNav } from "types/external-graphql-types"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { toDetailWorkPost } from "~/service/gateways/post"
import { toWorkPostLink } from "~/service/presenters/links"

type WorkPostTemplateProps = {
  data: WorkPostBySlugQuery
  pageContext: {
    previous: AroundNav | null
    next: AroundNav | null
  }
} & PageProps

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

  return (
    <CommonLayout>
      <div className="l-page-container">
        {typeof post !== `undefined` ? (
          <>
            <Post post={post} />
            <Sidebar
              bio={true}
              toc={{ headings: post.headings }}
              commonSidebar={true}
            />
          </>
        ) : (
          <div />
        )}
      </div>
    </CommonLayout>
  )
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
