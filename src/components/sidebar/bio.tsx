import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { BioQuery } from "@graphql-types"
// @ts-ignore
import styles from "./sidebar.module.scss"

const query = graphql`
  query Bio {
    avatar: file(absolutePath: { regex: "/icon.png/" }) {
      childImageSharp {
        fixed(width: 250, height: 250) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author {
          name
          summary
        }
      }
    }
  }
`

const Bio: React.FC = () => {
  const data: BioQuery = useStaticQuery(query)
  const author = data.site?.siteMetadata?.author
  const avatarImage = data.avatar?.childImageSharp?.fixed

  return (
    <section className={`m-card ${styles.bio}`}>
      {typeof avatarImage === `undefined` ? (
        <div style={{ height: `250px`, width: `250px` }} />
      ) : (
        <Image fixed={avatarImage} />
      )}
      <h1 className="name">{author?.name || `No Name`}</h1>
      <p className="summary">{author?.summary || `No Introduction`}</p>
    </section>
  )
}

export default Bio
