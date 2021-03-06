import React from "react"
import { PageProps, graphql } from "gatsby"

import type { AboutPageQuery } from "@graphql-types"
import { toDetailAboutPost } from "~/service/gateways/post"
import { Post } from "~/components/common/post"
import { Layout } from "~/components/layout"
import { Sidebar } from "~/components/sidebar"

interface AboutPageProps extends PageProps {
  data: AboutPageQuery
}

const AboutPage: React.VFC<AboutPageProps> = ({ data }: AboutPageProps) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const post = toDetailAboutPost(undefined, mdx)
  console.log(mdx, post)

  return (
    <Layout>
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
    </Layout>
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
