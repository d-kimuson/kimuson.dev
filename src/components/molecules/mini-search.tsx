import React, { useState, useEffect } from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Fuse from "fuse.js"

import { MiniSearchQuery, MarkdownRemarkEdge } from "@graphql-types"
import { filterDraft } from "@funcs/article"
import { getArticleLink } from "@funcs/links"
// @ts-ignore
import styles from "./mini-search.module.scss"

interface Page {
  title: string
  slug: string
  tagsString: string
}

const query = graphql`
  query MiniSearch {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            draft
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

interface MiniSearchProps {
  className?: string
}

const MiniSearch: React.FC<MiniSearchProps> = ({
  className,
}: MiniSearchProps) => {
  const data: MiniSearchQuery = useStaticQuery(query)
  const targets = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
    .filter(e => filterDraft(e))
    .map(e => ({
      title: e.node.frontmatter?.title,
      slug: e.node.fields?.slug,
      tagsString: e.node.frontmatter?.tags?.reduce((s, t) => `${s} ${t}`),
    }))
    .filter(
      (p): p is Page =>
        typeof (p.title && p.slug && p.tagsString) !== `undefined`
    )

  const fuse = new Fuse(targets, {
    keys: [`title`, `tagsString`],
  })

  const [keyword, setKeyword] = useState<string>(``)
  const [results, setResults] = useState<Page[]>([])

  useEffect(() => {
    setResults(
      fuse
        .search(keyword)
        .map(_ => _.item)
        .slice(0, 10)
    )
  }, [keyword])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    navigate(`/search/`, {
      state: {
        keyword: keyword,
      },
    })

    setKeyword(``)
    event.preventDefault()
  }

  return (
    <div className={className ? className : ``}>
      <div className={styles.searchField}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="keyword"
            className={styles.searchInput}
            onChange={(e): void => setKeyword(e.target.value)}
            value={keyword}
            placeholder="記事を検索する"
            autoComplete="off"
          />
          <button className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <ul className={styles.searchResultList}>
          {results.map(result => (
            <li key={result.slug}>
              <Link
                to={getArticleLink(result.slug)}
                className="m-remove-a-decoration"
              >
                {result.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MiniSearch
