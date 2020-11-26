import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

import type { BioQuery } from "@graphql-types"
// @ts-ignore
import styles from "./bio.module.scss"
import { toGatsbyImageFixedArg } from "@funcs/image"

const query = graphql`
  query Bio {
    avatar: file(absolutePath: { regex: "/icon.png/" }) {
      childImageSharp {
        fixed(width: 250, height: 250) {
          base64
          height
          src
          srcSet
          srcSetWebp
          srcWebp
          tracedSVG
          width
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

const imageStyle = { height: `200px`, width: `200px` }

export const Bio: React.FC = () => {
  const data = useStaticQuery<BioQuery>(query)
  const author = data.site?.siteMetadata?.author
  const avatarImage = data.avatar?.childImageSharp?.fixed

  return (
    <section className={`m-card ${styles.bio}`}>
      <h1 className="m-card__title">
        <FontAwesomeIcon icon={faUser} />
        <span>Author</span>
      </h1>
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

        <h2 className={styles.name}>{author?.name || `No Name`}</h2>

        <p className={styles.description}>
          {author?.summary || `No Introduction`}
        </p>
      </div>
    </section>
  )
}
