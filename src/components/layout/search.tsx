import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Fuse from "fuse.js"

import { SearchQuery } from "../../../types/graphql-types"

interface Page {
  title: string;
  slug: string;
}

const query = graphql`
  query Search {
    allMarkdownRemark {
        edges {
          node {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
    }
  }
`

const Search: React.FC = () => {
  const data: SearchQuery = useStaticQuery(query)
  const targets = data.allMarkdownRemark.edges
    .map(e => ({
      title: e.node.frontmatter?.title,
      slug: e.node.fields?.slug
    }))
    .filter((p): p is Page => typeof (p.title && p.slug) !== `undefined`)

  const fuse = new Fuse(targets, {
    keys: [`title`]
  })

  const [results, setResults] = useState<Page[]>([])

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    setResults(fuse
      .search(event.currentTarget.value)
      .map(_ => _.item)
      .slice(0, 10)
    )
  }

  return (
    <div>
      <input type="text" onKeyUp={handleKeyUp} />
      <ul>
        {results.map(result => (
          <li key={result.slug}>
            <Link to={result.slug}>{result.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Search
