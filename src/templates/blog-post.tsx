import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import { BlogPostBySlugQuery } from "../../types/graphql-types"
import Layout from "../components/layout"
import Head from "../components/head"

interface AroundNav {
  fields: {
    slug: string
  };
  frontmatter: {
    title: string
  }
}

interface BlogPostTemplateProps extends PageProps {
  data: BlogPostBySlugQuery;
  pageContext: {
    previous: AroundNav | null;
    next: AroundNav | null;
  }
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = (
  { data, pageContext }: BlogPostTemplateProps
) => {
  const post = data.markdownRemark
  const title = post?.frontmatter?.title || ""
  const html = post?.html || ""

  const { previous, next } = pageContext

  return (
    <>
      <Head
        title={post?.frontmatter?.title || ""}
        description={post?.frontmatter?.description || post?.excerpt || ""}
      />
      <Layout>
        <main role="main">
          <article>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </main>

        <div>
          {previous === null
            ? <div></div>
            : <Link to={previous.fields.slug}>
              {previous.frontmatter.title}
            </Link>
          }

          {next === null
            ? <div></div>
            : <Link to={next.fields.slug}>
              {next.frontmatter.title}
            </Link>
          }
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
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
