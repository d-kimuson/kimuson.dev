import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import { IndexQuery } from "../../types/graphql-types"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Head from "../components/head"
import { rhythm } from "../utils/typography"

interface IndexProps extends PageProps {
  data: IndexQuery;
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <>
      <Head />
      <Layout>
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
          )
        })}
      </Layout>
    </>
  )
}

export default Index

export const pageQuery = graphql`
  query Index {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
