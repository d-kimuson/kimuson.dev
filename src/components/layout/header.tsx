import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Navigation from "./navigation"

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
  const data = useStaticQuery(query)

  return (
    <header>
      <Link to="/">
        <h1>{data.site.siteMetadata.title}</h1>
        <Navigation />
      </Link>
    </header>
  )
}

export default Header
