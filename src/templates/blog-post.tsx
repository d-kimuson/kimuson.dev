import React from "react"
import { graphql, PageProps } from "gatsby"
import loadable from "loadable-components"
import { pipe } from "ramda"

import type { BlogPostBySlugQuery, MdxEdge } from "@graphql-types"
import type { AroundNav } from "@external-graphql-types"
import { toDetailBlogPost, toBlogPostList } from "@gateways/post"
import { filterDraftPostList } from "@presenters/post"
import { toBlogPostLink } from "@presenters/links"
import { Post } from "@components/templates/post"
import { Layout } from "@components/templates/layout"
import { Sidebar } from "@components/templates/sidebar"

const BlogPostListRow = loadable(async () => {
  const { BlogPostListRow } = await import(
    `../components/molecules/blog-post-list-row`
  )
  return BlogPostListRow
})

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
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const siteUrl = data.site?.siteMetadata?.siteUrl || `http://127.0.0.1`
  const postUrl = siteUrl + toBlogPostLink(mdx?.fields?.slug || ``)

  const post = toDetailBlogPost(postUrl, mdx)

  const relatedArticle = pipe(
    toBlogPostList,
    filterDraftPostList
  )(data.allMdx.edges.filter((e): e is MdxEdge => typeof e !== `undefined`))

  return (
    <Layout>
      <div className="l-page-container">
        {typeof post !== `undefined` ? (
          <>
            <Post post={post} />

            <Sidebar
              bio={true}
              toc={{ headings: post.headings }}
              commonSidebar={true}
            />
          </>
        ) : (
          <div />
        )}
      </div>

      {relatedArticle.length !== 0 ? (
        <BlogPostListRow blogPosts={relatedArticle} />
      ) : null}
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $category: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
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
