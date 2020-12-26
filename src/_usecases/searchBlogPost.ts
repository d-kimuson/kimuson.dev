import { curry } from "ramda"

import type { BlogPost } from "@entities/post"

export interface SearchBlogPost extends BlogPost {
  searchTitle: string
}

export const toSearchBlogPost = curry(
  (blogPost: BlogPost): SearchBlogPost => ({
    ...blogPost,
    searchTitle: blogPost.title.toLowerCase(),
  })
)

const isContainKeyword = (blogPost: SearchBlogPost, keyword: string): boolean =>
  blogPost.searchTitle.indexOf(keyword.toLowerCase()) > -1

export const searchByKeyword = curry(
  (keyword: string, blogPosts: SearchBlogPost[]): SearchBlogPost[] =>
    keyword === ``
      ? blogPosts
      : blogPosts.filter(blogPost => isContainKeyword(blogPost, keyword))
)

const haveTag = (blogPost: SearchBlogPost, tags: string[]): boolean =>
  tags.reduce(
    (s: boolean, tag: string) => s || blogPost.tags.includes(tag),
    false
  )

export const filterByTags = curry(
  (tags: string[], blogPosts: SearchBlogPost[]): SearchBlogPost[] =>
    tags.length === 0
      ? blogPosts
      : blogPosts.filter(blogPost => haveTag(blogPost, tags))
)
