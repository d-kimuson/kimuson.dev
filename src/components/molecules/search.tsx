import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Fuse from "fuse.js"

import { SearchQuery, MarkdownRemarkEdge } from "@graphql-types"
import { Article } from "@declaration"
import TagChecklist from "./tag-checklist"
import { edgeListToArticleList } from "@funcs/article"
import ArticleList from "./article-list"
// @ts-ignore
import styles from "./search.module.scss"

const query = graphql`
  query Search {
    allMarkdownRemark(
      filter: { fields: { slug: { regex: "//blog/" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
}

const Search: React.FC<SearchProps> = ({ className }: SearchProps) => {
  const data: SearchQuery = useStaticQuery(query)
  const edges = data.allMarkdownRemark.edges.filter(
    (e): e is MarkdownRemarkEdge => typeof e !== `undefined`
  )
  const articles: Article[] = edgeListToArticleList(edges)
  const tags = Array.from(new Set(articles.flatMap(article => article.tags)))

  const fuse = new Fuse(articles, {
    keys: [`title`],
  })

  const [keyword, setKeyword] = useState<string>(``)
  const [results, setResults] = useState<Article[]>(articles)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagsUpdated = (tags: string[]): void => {
    setSelectedTags(tags)
  }

  useEffect(() => {
    let updatedArticles
    if (keyword === ``) {
      updatedArticles = articles
    } else {
      updatedArticles = fuse.search(keyword).map(_ => _.item)
    }

    if (selectedTags.length !== 0) {
      updatedArticles = updatedArticles.filter(article =>
        selectedTags.reduce(
          (s: boolean, tag: string) => s || article.tags.includes(tag),
          false
        )
      )
    }

    setResults(updatedArticles)
  }, [keyword, selectedTags])

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

      <details>
        <summary className={styles.tagFilterDropdown}>タグで絞り込む</summary>
        <TagChecklist tags={tags} onUpdate={tagsUpdated} />
      </details>

      <ArticleList articles={results} />
    </section>
  )
}

export default Search
