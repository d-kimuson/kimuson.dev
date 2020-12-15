import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

import { TagChecklist } from "./tag-checklist"
import { BlogPostList } from "./blog-post-list"
// @ts-ignore
import styles from "./search.module.scss"

interface SearchProps {
  blogPosts: BlogPost[]
  className?: string
}

export const Search: React.FC<SearchProps> = ({
  blogPosts,
  className,
}: SearchProps) => {
  const searchBlogPosts = blogPosts.map(post => ({
    ...post,
    searchTitle: post.title.toLowerCase(),
  }))
  const tags = Array.from(
    new Set(searchBlogPosts.flatMap(article => article.tags))
  )

  const [keyword, setKeyword] = useState<string>(``)
  const [results, setResults] = useState<BlogPost[]>(searchBlogPosts)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagsUpdated = (tags: string[]): void => {
    setSelectedTags(tags)
  }

  useEffect(() => {
    let updatedBlogPosts
    if (keyword === ``) {
      updatedBlogPosts = searchBlogPosts
    } else {
      updatedBlogPosts = searchBlogPosts.filter(
        post => post.searchTitle.indexOf(keyword.toLowerCase()) > -1
      )
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
