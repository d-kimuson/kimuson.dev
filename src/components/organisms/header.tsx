import React, { useState } from "react"
import Image from "gatsby-image"
import { Link, useStaticQuery, graphql } from "gatsby"

import type { HeaderQuery } from "@graphql-types"
import { toUndefinedOrT } from "@funcs/type"
import { toGatsbyImageFixedArg } from "@funcs/image"
import { Navigation } from "../molecules/navigation"
// @ts-ignore
import styles from "./header.module.scss"

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

  const logoImage = toUndefinedOrT(data.file?.childImageSharp?.fixed)

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
            <Image fixed={toGatsbyImageFixedArg(logoImage)} />
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
