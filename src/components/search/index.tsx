import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { pipe } from "ramda"
import React, { useState, useEffect, memo } from "react"
import type { SearchBlogPost } from "./searchBlogPost"
import { BlogPostList } from "~/components/common/blog-post-list"
import { TagChecklist } from "~/components/common/tag-checklist"
import * as styles from "./search.module.scss"
import { searchByKeyword, filterByTags } from "./searchBlogPost"

type SearchProps = {
  blogPosts: SearchBlogPost[]
  className?: string
}

const Component: React.FC<SearchProps> = ({
  blogPosts,
  className,
}: SearchProps) => {
  const tags = Array.from(
    new Set(
      blogPosts.flatMap((blogPost) =>
        blogPost.__typename === `BlogPost` ? blogPost.tags : []
      )
    )
  )

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

export const Search = memo(Component)
