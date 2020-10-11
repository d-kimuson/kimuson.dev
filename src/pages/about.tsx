import React from "react"
import { PageProps, graphql } from "gatsby"

import { AboutPageQuery } from "@graphql-types"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"
// @ts-ignore
import styles from "../templates/blog-post.module.scss"

interface AboutPageProps extends PageProps {
  data: AboutPageQuery
}

const AboutPage: React.FC<AboutPageProps> = ({ data }: AboutPageProps) => {
  const title = data.file?.childMarkdownRemark?.frontmatter?.title || `About`
  const description =
    data.file?.childMarkdownRemark?.frontmatter?.description || ``

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
                  className={styles.articleBody}
                  dangerouslySetInnerHTML={{
                    __html: data.file?.childMarkdownRemark?.html || ``,
                  }}
                ></div>
              </section>
            </main>
          </div>
          <Sidebar
            bio={true}
            commonSidebar={true}
            toc={{ htmlAst: data.file?.childMarkdownRemark?.htmlAst }}
          />
        </div>
      </Layout>
    </>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query AboutPage {
    file(sourceInstanceName: { eq: "about" }) {
      id
      childMarkdownRemark {
        frontmatter {
          title
          description
        }
        html
        htmlAst
      }
    }
  }
`
