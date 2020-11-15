import React from "react"
import { PageProps, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import { AboutPageQuery } from "@graphql-types"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"

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
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <div className="m-article-body">
                  <MDXRenderer>{data.mdx?.body || ``}</MDXRenderer>
                </div>
              </section>
            </main>
          </div>
          <Sidebar
            bio={true}
            commonSidebar={true}
            // toc={{ htmlAst: data.mdx?.mdxAST }}
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
      mdxAST
    }
  }
`
