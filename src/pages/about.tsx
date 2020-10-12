import React from "react"
import { PageProps, graphql } from "gatsby"

import { AboutPageQuery } from "@graphql-types"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"

interface AboutPageProps extends PageProps {
  data: AboutPageQuery
}

const AboutPage: React.FC<AboutPageProps> = ({ data }: AboutPageProps) => {
  const title = data.markdownRemark?.frontmatter?.title || `About`
  const description = data.markdownRemark?.frontmatter?.description || ``

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                {/* <h1 className="m-page-title">{title}</h1> */}
                <div
                  className="m-article-body"
                  dangerouslySetInnerHTML={{
                    __html: data.markdownRemark?.html || ``,
                  }}
                ></div>
              </section>
            </main>
          </div>
          <Sidebar
            bio={true}
            commonSidebar={true}
            toc={{ htmlAst: data.markdownRemark?.htmlAst }}
          />
        </div>
      </Layout>
    </>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query AboutPage {
    markdownRemark(fields: { slug: { regex: "//about/" } }) {
      frontmatter {
        title
        description
      }
      html
      htmlAst
    }
  }
`
