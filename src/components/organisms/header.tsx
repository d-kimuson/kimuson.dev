import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

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

  return (
    <header
      className={`${styles.header} ${
        typeof className === `string` ? className : ``
      }`}
    >
      <Link to="/" className={`${styles.headerTitle} m-remove-a-decoration`}>
        <h1>{data.site?.siteMetadata?.title || `No Title`}</h1>
      </Link>

      <Navigation className={styles.headerNavArea} />
      <Search className={styles.headerSearchArea} />
    </header>
  )
}

export default Header
