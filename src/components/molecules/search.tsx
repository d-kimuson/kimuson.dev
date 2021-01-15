import React, { useState, useEffect } from "react"
import { pipe } from "ramda"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

import { SearchBlogPost, searchByKeyword, filterByTags } from "@usecases/searchBlogPost"
import { TagChecklist } from "./tag-checklist"
import { BlogPostList } from "./blog-post-list"
// @ts-ignore
import styles from "./search.module.scss"

interface SearchProps {
  blogPosts: SearchBlogPost[]
  className?: string
}

export const Search: React.FC<SearchProps> = ({
  blogPosts,
  className,
}: SearchProps) => {
  const tags = Array.from(new Set(
    blogPosts
      .flatMap(blogPost => blogPost.__typename === `BlogPost` ? blogPost.tags : [])
  ))

  // State
  const [keyword, setKeyword] = useState<string>(``)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [results, setResults] = useState<SearchBlogPost[]>(blogPosts)

  // キーワード更新 & タグの更新 (選択 / 選択解除)
  useEffect(() => {
    const search = searchByKeyword(keyword)
    const filter = filterByTags(selectedTags)
    pipe(search, filter, setResults)(blogPosts)
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
        <TagChecklist
          tags={tags}
          onUpdate={(tags: string[]): void => setSelectedTags(tags)}
        />
      </details>

      <BlogPostList blogPosts={results} />
    </section>
  )
}
