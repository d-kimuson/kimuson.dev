import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import Image from "gatsby-image"

import { BlogPostBySlugQuery } from "@graphql-types"
// @ts-ignore
import styles from "./blog-post.module.scss"
import Layout from "../components/layout"
import Head from "../components/head"
import Toc from "../components/sidebar/toc"
import Bio from "../components/sidebar/bio"
import CommonSidebar from "../components/sidebar/common-sidebar"
import TagList from "../components/tag-list"

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
  const tags = (post?.frontmatter?.tags || []).filter(
    (tag): tag is string => typeof tag === `string`
  )
  const maybeThumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
  const html = post?.html || ``

  const { previous, next } = pageContext

  return (
    <>
      <Head
        title={title}
        description={description}
        slug={post?.fields?.slug || ``}
      />
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
              <div className={styles.contentContainer}>
                <h1 className="m-page-title">
                  {post?.frontmatter?.draft ? `[非公開]` : ``}
                  {title}
                </h1>
                <time>{post?.frontmatter?.date}</time>
                <TagList tags={tags} isLink={true} />
                <div
                  className={styles.articleBody}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </article>
          </main>

          <div className={styles.navArticleContainer}>
            {previous === null ? (
              <div></div>
            ) : (
              <Link to={previous.fields.slug} className={styles.navPrevious}>
                {previous.frontmatter.title}
              </Link>
            )}

            {next === null ? (
              <div></div>
            ) : (
              <Link to={next.fields.slug} className={styles.navNext}>
                {next.frontmatter.title}
              </Link>
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
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY年MM月DD日")
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
