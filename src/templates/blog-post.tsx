import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import Image from "gatsby-image"

import { BlogPostBySlugQuery } from "../../types/graphql-types"
import Layout from "../components/layout"
import Head from "../components/head"
import Toc from "../components///sidebar/toc"
import Bio from "../components/sidebar/bio"
import CommonSidebar from "../components/sidebar/common-sidebar"
import styles from "./blog-post.module.scss"

interface AroundNav {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
  }
}

interface BlogPostTemplateProps extends PageProps {
  data: BlogPostBySlugQuery
  pageContext: {
    previous: AroundNav | null
    next: AroundNav | null
  }
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data,
  pageContext,
}: BlogPostTemplateProps) => {
  const post = data.markdownRemark
  const title = post?.frontmatter?.title || ``
  const description = post?.frontmatter?.description || post?.excerpt || ``
  const maybeThumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
  const html = post?.html || ``

  const { previous, next } = pageContext

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-main-wrapper">
          <main role="main">
            <article className={`${styles.article} m-card`}>
              {typeof maybeThumbnail !== `undefined` ? (
                <Image
                  fluid={maybeThumbnail}
                  backgroundColor="#000"
                  className={styles.thumbnail}
                />
              ) : null}
              <h1 className="m-page-title">
                {post?.frontmatter?.draft ? `[非公開]` : ``}
                {title}
              </h1>
              <div
                className={styles.articleBody}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </article>
          </main>

          <div>
            {previous === null ? (
              <div></div>
            ) : (
              <Link to={previous.fields.slug}>
                {previous.frontmatter.title}
              </Link>
            )}

            {next === null ? (
              <div></div>
            ) : (
              <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
            )}
          </div>
        </div>

        <div className="l-sidebar-container">
          <Bio />

          <div className="l-sidebar-sticky-area">
            <Toc htmlAst={post?.htmlAst} />
            <CommonSidebar />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      htmlAst
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        category
        tags
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
  }
`
