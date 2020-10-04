import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Fuse from "fuse.js"

import { SearchQuery, MarkdownRemarkEdge } from "@graphql-types"
import { Article } from "@declaration"
import { edgeListToArticleList } from "@funcs/article"
import ArticleList from "./article-list"
// @ts-ignore
import styles from "./search.module.scss"

const query = graphql`
  query Search {
    allMarkdownRemark {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            draft
            category
            tags
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 200) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`

interface SearchProps {
  className?: string
  initKeyword?: string
}

interface ArticleForFuse extends Article {
  tagsString: string
}

const Search: React.FC<SearchProps> = ({
  className,
  initKeyword = ``,
}: SearchProps) => {
  const data: SearchQuery = useStaticQuery(query)
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const articles: ArticleForFuse[] = edgeListToArticleList(edges).map(
    article => ({
      ...article,
      tagsString: article.tags.reduce((s, t) => `${s} ${t}`),
    })
  )

  const fuse = new Fuse(articles, {
    keys: [`title`, `tagsString`],
  })

  const [keyword, setKeyword] = useState<string>(initKeyword)
  const [results, setResults] = useState<Article[]>([])

  useEffect(() => {
    setResults(
      fuse
        .search(keyword)
        .map(_ => _.item)
        .slice(0, 10)
    )
  }, [keyword])

  return (
    <section className={className ? className : ``}>
      <form
        className={styles.searchForm}
        onSubmit={(e): void => e.preventDefault()}
      >
        <input
          type="text"
          name="keyword"
          className={styles.searchInput}
          onChange={(e): void => setKeyword(e.target.value)}
          value={keyword}
          placeholder="記事を検索する"
          autoComplete="off"
          autoFocus={true}
        />
        <button className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>

      <ArticleList articles={results} />
    </section>
  )
}

export default Search
