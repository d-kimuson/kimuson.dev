import React, { useState, memo } from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link, useStaticQuery, graphql } from "gatsby"

import * as styles from "./header.module.scss"
import type { HeaderQuery } from "@graphql-types"
import { Navigation } from "./navigation"

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

export const Component: React.VFC<HeaderProps> = ({
  className,
}: HeaderProps) => {
  const data = useStaticQuery<HeaderQuery>(query)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

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
          <StaticImage
            src="./logo_transparent.png"
            layout="fixed"
            height={60}
            alt={data.site?.siteMetadata?.title ?? ""}
            backgroundColor={"transparent"}
          />
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

export const Header = memo(Component)
