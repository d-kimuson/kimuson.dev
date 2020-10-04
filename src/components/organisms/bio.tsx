import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { BioQuery } from "@graphql-types"
// @ts-ignore
import styles from "./bio.module.scss"
import { toGatsbyImageFixedArg } from "@funcs/image"

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

const imageStyle = { height: `250px`, width: `250px` }

const Bio: React.FC = () => {
  const data: BioQuery = useStaticQuery(query)
  const author = data.site?.siteMetadata?.author
  const avatarImage = data.avatar?.childImageSharp?.fixed

  return (
    <section className={`m-card ${styles.bio}`}>
      <h1 className="m-card__title">{author?.name || `No Name`}</h1>
      <div className="m-card__content">
        <div className={styles.bioImageWrapper}>
          {typeof avatarImage === `object` && avatarImage !== null ? (
            <Image
              fixed={toGatsbyImageFixedArg(avatarImage)}
              style={imageStyle}
            />
          ) : (
            <div style={imageStyle} />
          )}
        </div>

        <p>{author?.summary || `No Introduction`}</p>
      </div>
    </section>
  )
}

export default Bio
