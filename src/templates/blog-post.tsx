import React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Image from "gatsby-image"
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share"

import type { BlogPostBySlugQuery, MdxEdge } from "@graphql-types"
import type { MdxAst } from "@declaration"
import { toGatsbyImageFluidArg } from "@funcs/image"
import { getBlogPostLink } from "@funcs/links"
import { convertToBlogPostList, filterDraft } from "@funcs/post"
import Layout from "@components/templates/layout"
import Head from "@components/templates/head"
import Sidebar from "@components/templates/sidebar"
import BlogPostListRow from "@components/molecules/blog-post-list-row"
import TagList from "@components/molecules/tag-list"
import Date from "@components/atoms/date"
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

interface BlogPostTemplateProps extends PageProps {
  data: BlogPostBySlugQuery
  pageContext: {
    previous: AroundNav | null
    next: AroundNav | null
  }
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data,
}: BlogPostTemplateProps) => {
  console.log(`data: `, data)
  const post = data.mdx
  const title = post?.frontmatter?.title || ``
  const description = post?.frontmatter?.description || post?.excerpt || ``
  const tags = (post?.frontmatter?.tags || []).filter(
    (tag): tag is string => typeof tag === `string`
  )
  const thumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
  const siteUrl = data.site?.siteMetadata?.siteUrl || `http://127.0.0.1`
  const articleUrl = siteUrl + getBlogPostLink(post?.fields?.slug || ``)
  const articleSize = 40

  const relatedArticle = convertToBlogPostList(
    data.allMdx.edges.filter((e): e is MdxEdge => typeof e !== `undefined`)
  ).filter(filterDraft)

  const mdxAst: MdxAst = post?.mdxAST

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

                  <div className="m-article-body">
                    <MDXRenderer>{post?.body || ``}</MDXRenderer>
                  </div>
                </div>

                <hr className={styles.sepLine} />

                <footer className={styles.footerContainer}>
                  <div className={styles.snsArea}>
                    <FacebookShareButton url={articleUrl}>
                      <FacebookIcon size={articleSize} round />
                    </FacebookShareButton>

                    <LineShareButton url={articleUrl}>
                      <LineIcon size={articleSize} round />
                    </LineShareButton>

                    <LinkedinShareButton url={articleUrl}>
                      <LinkedinIcon size={articleSize} round />
                    </LinkedinShareButton>

                    <TwitterShareButton
                      title={title}
                      via="_kimuson"
                      url={articleUrl}
                    >
                      <TwitterIcon size={articleSize} round />
                    </TwitterShareButton>
                  </div>

                  <div className={styles.tagArea}>
                    <TagList tags={tags} isLink={true} />
                  </div>
                </footer>
              </article>
            </main>
          </div>

          <Sidebar bio={true} toc={{ mdxAst: mdxAst }} commonSidebar={true} />
        </div>

        {relatedArticle.length !== 0 ? (
          <BlogPostListRow blogPosts={relatedArticle} />
        ) : null}
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $category: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      mdxAST
      fields {
        slug
      }
      frontmatter {
        title
        date
        description
        category
        tags
        draft
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 590) {
              aspectRatio
              base64
              sizes
              src
              srcSet
              srcWebp
              srcSetWebp
              tracedSVG
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
    allMdx(
      filter: {
        frontmatter: { category: { eq: $category } }
        fields: { slug: { ne: $slug } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            draft
            category
            tags
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 200) {
                  aspectRatio
                  base64
                  sizes
                  src
                  srcSet
                  srcWebp
                  srcSetWebp
                  tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
