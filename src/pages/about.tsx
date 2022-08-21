import { graphql } from "gatsby"
import React from "react"
import type { AboutPageQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { toDetailAboutPost } from "~/service/gateways/post"

type AboutPageProps = {
  data: AboutPageQuery
} & PageProps

const AboutPage: React.FC<AboutPageProps> = ({ data }: AboutPageProps) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const post = toDetailAboutPost(undefined, mdx)

  return (
    <CommonLayout>
      <div className="l-page-container">
        {typeof post !== `undefined` ? (
          <>
            <Post post={post} />
            <Sidebar
              bio={true}
              commonSidebar={true}
              toc={{ headings: post.headings }}
            />
          </>
        ) : (
          <div />
        )}
      </div>
    </CommonLayout>
  )
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
