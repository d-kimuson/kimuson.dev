import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Fuse from "fuse.js"

import { SearchQuery, MarkdownRemarkEdge } from "@graphql-types"
import { filterDraft } from "@funcs/article"
// @ts-ignore
import styles from "./search.module.scss"

interface Page {
  title: string
  slug: string
}

const query = graphql`
  query Search {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            draft
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

interface SearchProps {
  className?: string
}

const Search: React.FC<SearchProps> = ({ className }: SearchProps) => {
  const data: SearchQuery = useStaticQuery(query)
  const targets = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
    .filter(e => filterDraft(e))
    .map(e => ({
      title: e.node.frontmatter?.title,
      slug: e.node.fields?.slug,
    }))
    .filter((p): p is Page => typeof (p.title && p.slug) !== `undefined`)

  const fuse = new Fuse(targets, {
    keys: [`title`],
  })

  const [results, setResults] = useState<Page[]>([])

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    console.log(event.currentTarget.value)
    setResults(
      fuse
        .search(event.currentTarget.value)
        .map(_ => _.item)
        .slice(0, 10)
    )
  }

  return (
    <div className={className ? className : ``}>
      <div className={styles.searchField}>
        <input
          type="text"
          name="keyword"
          onKeyUp={handleKeyUp}
          placeholder="記事を検索する"
          autoComplete="off"
        />
        <ul className={styles.searchResultList}>
          {results.map(result => (
            <li key={result.slug}>
              <Link to={result.slug} className="m-remove-a-decoration">
                {result.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Search
