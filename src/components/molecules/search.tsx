import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Fuse from "fuse.js"

import type { SearchQuery, MdxEdge } from "@graphql-types"
import TagChecklist from "./tag-checklist"
import { convertToBlogPostList } from "@funcs/post"
import BlogPostList from "./blog-post-list"
// @ts-ignore
import styles from "./search.module.scss"

const query = graphql`
  query Search {
    allMdx(
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
                fluid(maxHeight: 90, traceSVG: { background: "#fafafa" }) {
                  aspectRatio
                  base64
                  sizes
                  src
                  srcSet
                  srcWebp
                  srcSetWebp
                  tracedSVG
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
  const data = useStaticQuery<SearchQuery>(query)
  const edges = data.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const blogPosts: BlogPost[] = convertToBlogPostList(edges)
  const tags = Array.from(new Set(blogPosts.flatMap(article => article.tags)))

  const fuse = new Fuse(blogPosts, {
    keys: [`title`],
  })

  const [keyword, setKeyword] = useState<string>(``)
  const [results, setResults] = useState<BlogPost[]>(blogPosts)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagsUpdated = (tags: string[]): void => {
    setSelectedTags(tags)
  }

  useEffect(() => {
    let updatedBlogPosts
    if (keyword === ``) {
      updatedBlogPosts = blogPosts
    } else {
      updatedBlogPosts = fuse.search(keyword).map(_ => _.item)
    }

    if (selectedTags.length !== 0) {
      updatedBlogPosts = updatedBlogPosts.filter(article =>
        selectedTags.reduce(
          (s: boolean, tag: string) => s || article.tags.includes(tag),
          false
        )
      )
    }

    setResults(updatedBlogPosts)
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

      <BlogPostList blogPosts={results} />
    </section>
  )
}

export default Search
