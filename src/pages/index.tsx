import React from "react"
import { graphql, PageProps } from "gatsby"

import { IndexQuery } from "../../types/graphql-types"
import { Article } from "../../types/declaration"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Head from "../components/head"
import ArticleList from "../components/article-list"

interface IndexProps extends PageProps {
  data: IndexQuery;
}

const Index: React.FC<IndexProps> = ({ data }: IndexProps) => {
  const posts = data.allMarkdownRemark.edges
    .map(e => ({
      slug: e.node.fields?.slug,
      title: e.node.frontmatter?.title || `No Title`,
      description: e.node.frontmatter?.description || e.node.excerpt || ``,
      date: e.node.frontmatter?.date,
      thumbnail: e.node.frontmatter?.thumbnail?.childImageSharp?.fluid,
      draft: e.node.frontmatter?.draft || true,
      category: e.node.frontmatter?.category,
      tags: e.node.frontmatter?.tags?.map(tag => String(tag)) || []
    }))
    .filter((post): post is Article => (
      typeof post.slug === `string` &&
      typeof post.date === `string` &&
      typeof post.category === `string`
    ))

  return (
    <>
      <Head />
      <Layout>
        <div className="l-main-container">
          <main role="main">
            <section>
              <ArticleList articles={posts} />
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
            title
            description
            date(formatString: "MMMM DD, YYYY")
            draft
            category
            tags
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 300) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
