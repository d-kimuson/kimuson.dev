import type { Dayjs } from "dayjs"

type Draftable = {
  draft?: boolean
}

export const isDraft = (post: Draftable): boolean => !post.draft

export const filterDraftPostList = <T extends Draftable>(posts: T[]): T[] =>
  posts.filter(
    (post) => isDraft(post) || process.env.NODE_ENV === `development`
  )

export const sortPostList = <T extends { date: Dayjs }>(posts: T[]): T[] =>
  posts.sort((a: T, b: T) => (a.date.isBefore(b.date) ? 1 : -1))

export const postSortKey = (a: Draftable, b: Draftable): number =>
  a.draft && !b.draft ? 1 : !a.draft && b.draft ? -1 : 0

export const sortDraftPostList = <T extends Draftable>(posts: T[]): T[] =>
  posts.sort(postSortKey)

export const processDraftPostList = <T extends Draftable>(posts: T[]): T[] => {
  return process.env.NODE_ENV === `development`
    ? sortDraftPostList(posts)
    : filterDraftPostList(posts)
}
