import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

import * as styles from "./bio.module.scss"
import type { BioQuery } from "@graphql-types"

const query = graphql`
  query Bio {
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

const Component: React.VFC = () => {
  const data = useStaticQuery<BioQuery>(query)
  const author = data.site?.siteMetadata?.author

  return (
    <section className={`m-card ${styles.bio}`}>
      <h1 className="m-card__title">
        <FontAwesomeIcon icon={faUser} />
        <span>Author</span>
      </h1>
      <div className="m-card__content">
        <div className={styles.bioImageWrapper}>
          <StaticImage
            src="./icon.png"
            layout="fixed"
            height={200}
            width={200}
            alt=""
          />
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
