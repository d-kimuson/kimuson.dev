import React from "react"
import { graphql, PageProps } from "gatsby"
import Image from "gatsby-image"

import { WorkPostBySlugQuery } from "@graphql-types"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"
import Date from "../components/atoms/date"
import { toGatsbyImageFluidArg } from "@funcs/image"
// @ts-ignore
import styles from "./blog-post.module.scss"

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
  const post = data.markdownRemark
  const title = post?.frontmatter?.title || ``
  const description = post?.frontmatter?.description || post?.excerpt || ``
  const thumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
  const html = post?.html || ``

  return (
    <>
      <Head
        title={title}
        description={description}
        slug={post?.fields?.slug || ``}
      />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <article className={`m-card l-main-width`}>
                {typeof thumbnail === `object` && thumbnail !== null ? (
                  <Image
                    fluid={toGatsbyImageFluidArg(thumbnail)}
                    className={styles.thumbnail}
                  />
                ) : (
                  <div />
                )}
                <div className={styles.contentContainer}>
                  <h1 className="m-page-title">
                    {post?.frontmatter?.draft ? `[非公開]` : ``}
                    {title}
                  </h1>
                  <Date date={post?.frontmatter?.date} />

                  <div
                    className="m-article-body"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              </article>
            </main>
          </div>

          <Sidebar
            bio={true}
            toc={{ htmlAst: post?.htmlAst }}
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      htmlAst
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
            fluid(maxWidth: 590) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
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
