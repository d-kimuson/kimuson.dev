import React from "react"
import { PageProps, graphql } from "gatsby"

import type { AboutPageQuery } from "@graphql-types"
import { toUndefinedOrT } from "@funcs/type"
import { Post } from "@components/templates/post"
import { Layout } from "@components/templates/layout"
import { Head } from "@components/templates/head"
import { Sidebar } from "@components/templates/sidebar"

interface AboutPageProps extends PageProps {
  data: AboutPageQuery
}

const AboutPage: React.FC<AboutPageProps> = ({ data }: AboutPageProps) => {
  const title = data.mdx?.frontmatter?.title || `About`
  const description = data.mdx?.frontmatter?.description || ``

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <Post title={title} post={toUndefinedOrT(data?.mdx)} />
          <Sidebar
            bio={true}
            commonSidebar={true}
            toc={{ tableOfContents: data.mdx?.tableOfContents }}
          />
        </div>
      </Layout>
    </>
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
      body
      tableOfContents
    }
  }
`
