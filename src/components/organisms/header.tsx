import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

import { HeaderQuery } from "@graphql-types"
import Navigation from "../molecules/navigation"
import Search from "../molecules/mini-search"
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
  const data: HeaderQuery = useStaticQuery(query)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

  return (
    <header
      className={`${styles.header} ${
        typeof className === `string` ? className : ``
      }`}
    >
      {/* Basic */}
      <Link to="/" className={`${styles.headerTitle} m-remove-a-decoration`}>
        <h1>{data.site?.siteMetadata?.title || `No Title`}</h1>
      </Link>

      <Navigation className={styles.headerNavArea} />
      <Search className={styles.headerSearchArea} />

      {/* Responsive */}
      <Link
        to="/search/"
        className={`m-remove-a-decoration ${styles.responsiveHeaderSearch}`}
      >
        <FontAwesomeIcon icon={faSearch} />
      </Link>
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
