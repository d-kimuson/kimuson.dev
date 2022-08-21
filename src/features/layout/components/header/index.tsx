import classnames from "classnames"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React, { useState } from "react"
import type { HeaderQuery } from "@graphql-types"
import { Portal } from "~/features/layout/components/portal"
import { Link } from "~/functional/mdx/link"
import * as styles from "./header.module.scss"
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

type HeaderProps = {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }: HeaderProps) => {
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
        className={classnames(styles.headerTitleArea, "m-remove-a-decoration")}
      >
        <h1 className={styles.headerTitle}>
          <StaticImage
            src="./logo_transparent.png"
            layout="fixed"
            alt={data.site?.siteMetadata?.title ?? ""}
            height={60}
            backgroundColor="transparent"
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

        <Portal>
          <Navigation
            id="drawerMenu"
            className={classnames(styles.drawerMenu, "m-z2")}
            aria-hidden={!isOpenMenu}
          />
        </Portal>
      </div>
    </header>
  )
}
