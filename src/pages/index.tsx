import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import { IndexQuery } from "../../types/graphql-types"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Head from "../components/head"

interface IndexProps extends PageProps {
  data: IndexQuery;
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-container">
          <main role="main">
            <section>
              {posts.map(({ node }) => {
                const title = node.frontmatter?.title || `No Title`

                return (
                  <section key={node.fields.slug}>
                    <header>
                      <h3>
                        <Link to={node.fields.slug}>
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
                  </section>
                )
              })}
            </section>
          </main>
        </div>
        <div className="l-sidebar-container">
          <p>さいどばー</p>
          <Bio />
        </div>
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
