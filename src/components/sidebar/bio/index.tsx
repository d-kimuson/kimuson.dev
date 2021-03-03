import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

import styles from "./bio.module.scss"
import type { BioQuery } from "@graphql-types"
import { toFixedImage } from "~/service/gateways/image"

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

const Component: React.VFC = () => {
  const data = useStaticQuery<BioQuery>(query)
  const author = data.site?.siteMetadata?.author
  const avatarImage = toFixedImage(data.avatar?.childImageSharp?.fixed)

  return (
    <section className={`m-card ${styles.bio}`}>
      <h1 className="m-card__title">
        <FontAwesomeIcon icon={faUser} />
        <span>Author</span>
      </h1>
      <div className="m-card__content">
        <div className={styles.bioImageWrapper}>
          {typeof avatarImage !== `undefined` ? (
            <Image fixed={avatarImage} style={imageStyle} />
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

export const Bio = Component
