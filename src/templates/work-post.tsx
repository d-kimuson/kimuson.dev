import React from "react"
import { graphql, PageProps } from "gatsby"

import type { WorkPostBySlugQuery } from "@graphql-types"
import type { AroundNav } from "types/external-graphql-types"
import { toDetailWorkPost } from "~/service/gateways/post"
import { toWorkPostLink } from "~/service/presenters/links"
import { Post } from "~/components/common/post"
import { Layout } from "~/components/layout"
import { Sidebar } from "~/components/sidebar"

interface WorkPostTemplateProps extends PageProps {
  data: WorkPostBySlugQuery
  pageContext: {
    previous: AroundNav | null
    next: AroundNav | null
  }
}

const WorkPostTemplate: React.FC<WorkPostTemplateProps> = ({
  data,
}: WorkPostTemplateProps) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const siteUrl = data.site?.siteMetadata?.siteUrl || `http://127.0.0.1`
  const postUrl = siteUrl + toWorkPostLink(mdx?.fields?.slug || ``)

  const post = toDetailWorkPost(postUrl, mdx)

  return (
    <Layout>
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
    </Layout>
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
            fluid(maxWidth: 590, traceSVG: { background: "#333846" }) {
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
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
