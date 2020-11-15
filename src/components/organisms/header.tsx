import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import type { HeaderQuery } from "@graphql-types"
import Navigation from "../molecules/navigation"
// @ts-ignore
import styles from "./header.module.scss"

const query = graphql`
  query Header {
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

const Header: React.FC<HeaderProps> = ({ className }: HeaderProps) => {
  const data = useStaticQuery<HeaderQuery>(query)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

  return (
    <header
      className={`${styles.header} ${
        typeof className === `string` ? className : ``
      }`}
    >
      {/* Basic */}
      <Link
        to="/"
        className={`${styles.headerTitleArea} m-remove-a-decoration`}
      >
        <h1 className={styles.headerTitle}>
          {data.site?.siteMetadata?.title || `No Title`}
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

export default Header
