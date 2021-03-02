import React, { useState } from "react"
import Image from "gatsby-image"
import { Link, useStaticQuery, graphql } from "gatsby"

import styles from "./header.module.scss"
import type { HeaderQuery } from "@graphql-types"
import { toFixedImage } from "~/_gateways/image"
import { Navigation } from "~/components/molecules/navigation"

const query = graphql`
  query Header {
    file(relativePath: { eq: "assets/logo_transparent.png" }) {
      childImageSharp {
        fixed(height: 60) {
          width
          height
          src
          srcSet
          base64
          srcWebp
          srcSetWebp
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }: HeaderProps) => {
  const data = useStaticQuery<HeaderQuery>(query)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

  const logoImage = toFixedImage(data.file?.childImageSharp?.fixed)

  return (
    <header
      className={`m-un-selectable ${styles.header} ${
        typeof className === `string` ? className : ``
      }`}
    >
      {/* Basic */}
      <Link
        to="/"
        className={`${styles.headerTitleArea} m-remove-a-decoration`}
      >
        <h1 className={styles.headerTitle}>
          {typeof logoImage !== `undefined` ? (
            <Image fixed={logoImage} />
          ) : (
            data.site?.siteMetadata?.title || `No Title`
          )}
        </h1>
      </Link>

      <Navigation className={styles.headerNavArea} />

      {/* Responsive */}
      <div className={styles.responsiveHeaderNav}>
        <button
          className={styles.menuButton}
          type="button"
          aria-controls="drawerMenu"
          aria-expanded={isOpenMenu}
          aria-label="ここからメニューを開きます"
          onClick={(): void => setIsOpenMenu(!isOpenMenu)}
        >
          <div className={styles.menuButtonItem}></div>
          <div className={styles.menuButtonItem}></div>
          <div className={styles.menuButtonItem}></div>
        </button>

        <Navigation
          id="drawerMenu"
          className={styles.drawerMenu}
          aria-hidden={!isOpenMenu}
        />
      </div>
    </header>
  )
}
