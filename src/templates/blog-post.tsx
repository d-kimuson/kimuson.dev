import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import Image from "gatsby-image"

import { BlogPostBySlugQuery } from "@graphql-types"
// @ts-ignore
import styles from "./blog-post.module.scss"
import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"
import TagList from "../components/molecules/tag-list"
import Date from "../components/atoms/date"
import { toGatsbyImageFluidArg } from "@funcs/image"

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
  const thumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
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
            <article className={`m-card l-main-width`}>
              {typeof thumbnail === `object` && thumbnail !== null ? (
                <Image
                  fluid={toGatsbyImageFluidArg(thumbnail)}
                  backgroundColor="#000"
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
                <TagList tags={tags} isLink={true} />
                <div
                  className={styles.articleBody}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </article>
          </main>

          <section className="m-card l-main-width">
            <h1 className="m-card__title-reverse">
              この辺にも興味あるんじゃない?
            </h1>
            <div className="m-card__content"></div>
          </section>

          <div className={`${styles.navArticleContainer} l-main-width`}>
            {previous === null ? (
              <div></div>
            ) : (
              <Link to={previous.fields.slug} className={styles.navPrevious}>
                {previous.frontmatter.title}
              </Link>
            )}

            <div className="nav-margin"></div>

            {next === null ? (
              <div></div>
            ) : (
              <Link to={next.fields.slug} className={styles.navNext}>
                {next.frontmatter.title}
              </Link>
            )}
          </div>
        </div>

        <Sidebar
          bio={true}
          toc={{ htmlAst: post?.htmlAst }}
          commonSidebar={true}
        />
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
