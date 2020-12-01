import React from "react"
import { graphql, PageProps } from "gatsby"

import type { BlogPostBySlugQuery, MdxEdge } from "@graphql-types"
import { getBlogPostLink } from "@funcs/links"
import { convertToBlogPostList, filterDraft } from "@funcs/post"
import { toUndefinedOrT } from "@funcs/type"
import { Post } from "@components/templates/post"
import { Layout } from "@components/templates/layout"
import { Head } from "@components/templates/head"
import { Sidebar } from "@components/templates/sidebar"
import { BlogPostListRow } from "@components/molecules/blog-post-list-row"

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
  const post = data.mdx

  const title = post?.frontmatter.title || ``
  const description = post?.frontmatter?.description || post?.excerpt || ``
  const thumbnail = post?.frontmatter?.thumbnail?.childImageSharp?.fluid
  const siteUrl = data.site?.siteMetadata?.siteUrl || `http://127.0.0.1`
  const postUrl = siteUrl + getBlogPostLink(post?.fields?.slug || ``)
  const relatedArticle = convertToBlogPostList(
    data.allMdx.edges.filter((e): e is MdxEdge => typeof e !== `undefined`)
  ).filter(filterDraft)

  return (
    <>
      <Head
        title={title}
        description={description}
        imageUrl={toUndefinedOrT(post?.frontmatter?.thumbnail?.publicURL)}
        slug={post?.fields?.slug || ``}
      />
      <Layout>
        <div className="l-page-container">
          <Post
            title={title}
            thumbnail={toUndefinedOrT(thumbnail)}
            frontmatter={toUndefinedOrT(post?.frontmatter)}
            postUrl={postUrl}
            post={toUndefinedOrT(post)}
          />

          <Sidebar
            bio={true}
            toc={{ tableOfContents: post?.tableOfContents }}
            commonSidebar={true}
          />
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
      tableOfContents
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
          publicURL
          childImageSharp {
            fluid(maxWidth: 590, traceSVG: { background: "#333846" }) {
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
                fluid(maxHeight: 200, traceSVG: { background: "#333846" }) {
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
