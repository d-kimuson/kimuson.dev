import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import { HeaderQuery } from "../../../types/graphql-types"
import Navigation from "./navigation"
import styles from "./layout.module.scss"

const query = graphql`
  query Header {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Header: React.FC = () => {
  const data: HeaderQuery = useStaticQuery(query)

  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>{data.site?.siteMetadata?.title || `No Title`}</h1>
      </Link>

      <Navigation />
    </header>
  )
}

export default Header
