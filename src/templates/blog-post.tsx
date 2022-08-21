import { graphql } from "gatsby"
import loadable from "loadable-components"
import { pipe } from "ramda"
import React from "react"
import type { BlogPostBySlugQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge, PostMdx } from "types/external-graphql-types"
import type { AroundNav } from "types/external-graphql-types"
import type { BlogPostListRow as IBlogPostListRow } from "~/features/blog/components/blog-post-list-row"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { toDetailBlogPost, toBlogPostList } from "~/service/gateways/post"
import { toBlogPostLink } from "~/service/presenters/links"
import { filterDraftPostList } from "~/service/presenters/post"

// FIXME: 一時的な対応なのでできればちゃんと直して
const BlogPostListRow = loadable(async () => {
  const { BlogPostListRow } = await import(
    `../features/blog/components/blog-post-list-row`
  )
  return BlogPostListRow
}) as unknown as typeof IBlogPostListRow

type BlogPostTemplateProps = {
  data: BlogPostBySlugQuery
  pageContext: {
    previous: AroundNav | null
    next: AroundNav | null
  }
} & PageProps

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data,
}: BlogPostTemplateProps) => {
  const mdx = data.mdx
  if (!mdx) {
    throw Error
  }

  const siteUrl = data.site?.siteMetadata?.siteUrl ?? `http://127.0.0.1`
  const postUrl = siteUrl + toBlogPostLink(mdx.fields?.slug ?? ``)

  const post = toDetailBlogPost(postUrl, mdx as PostMdx)

  const relatedArticle = pipe(
    toBlogPostList,
    filterDraftPostList
  )(data.allMdx.edges.filter((e): e is PostMdxEdge => typeof e !== `undefined`))

  return (
    <CommonLayout>
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
    </CommonLayout>
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
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: TRACED_SVG
              formats: [AUTO, WEBP, AVIF]
            )
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
                gatsbyImageData(
                  layout: FULL_WIDTH
                  placeholder: TRACED_SVG
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
      }
    }
  }
`
