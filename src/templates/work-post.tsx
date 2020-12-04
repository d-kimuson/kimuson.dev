import React from "react"
import { graphql, PageProps } from "gatsby"

import type { WorkPostBySlugQuery } from "@graphql-types"
import { getWorkPostLink } from "@funcs/links"
import { toUndefinedOrT } from "@funcs/type"
import { Post } from "@components/templates/post"
import { Layout } from "@components/templates/layout"
import { Head } from "@components/templates/head"
import { Sidebar } from "@components/templates/sidebar"

interface AroundNav {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
  }
}

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
  const post = data.mdx
  const title = post?.frontmatter?.title || ``
  const description = post?.frontmatter?.description || ``
  const thumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid

  return (
    <>
      <Head
        title={title}
        description={description}
        slug={getWorkPostLink(post?.fields?.slug || ``)}
      />
      <Layout>
        <div className="l-page-container">
          <Post
            title={title}
            frontmatter={post?.frontmatter}
            thumbnail={toUndefinedOrT(thumbnail)}
            post={toUndefinedOrT(post)}
          />
          <Sidebar
            bio={true}
            toc={{ tableOfContents: post?.tableOfContents }}
            commonSidebar={true}
          />
        </div>
      </Layout>
    </>
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
