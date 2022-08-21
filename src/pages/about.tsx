import { graphql } from "gatsby"
import React from "react"
import type { AboutPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import { toDetailAboutPost } from "~/features/blog/services/post"
import { AboutPageContent } from "~/page-contents/about"

type AboutPageProps = PageProps<AboutPageQuery>

const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const post = toDetailAboutPost(undefined, mdx)
  if (post === undefined) {
    throw Error
  }

  return <AboutPageContent post={post} />
}

export default AboutPage

export const pageQuery = graphql`
  query AboutPage {
    mdx(fields: { slug: { regex: "//about/" } }) {
      frontmatter {
        title
        description
      }
      fields {
        slug
      }
      body
      tableOfContents
    }
  }
`
