import { graphql } from "gatsby"
import { pipe } from "ramda"
import React from "react"
import type { BlogPostBySlugQuery } from "@graphql-types"
import type { PageProps } from "gatsby"
import type { PostMdxEdge, PostMdx } from "types/external-graphql-types"
import type { AroundNav } from "types/external-graphql-types"
import { toDetailBlogPost, toBlogPostList } from "~/features/blog/services/post"
import { filterDraftPostList } from "~/features/blog/services/post"
import { BlogPostPageContent } from "~/page-contents/blog-post"
import { toBlogPostLink } from "~/service/links"

type BlogPostTemplateProps = PageProps<
  BlogPostBySlugQuery,
  {
    previous: AroundNav | null
    next: AroundNav | null
  }
>

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

  const relatedArticles = pipe(
    toBlogPostList,
    filterDraftPostList
  )(data.allMdx.edges.filter((e): e is PostMdxEdge => typeof e !== `undefined`))

  if (post === undefined) {
    throw new Error()
  }

  return <BlogPostPageContent post={post} relatedArticles={relatedArticles} />
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
