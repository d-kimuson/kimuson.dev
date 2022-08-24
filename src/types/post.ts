import type { Dayjs } from "dayjs"
import type { IGatsbyImageData } from "gatsby-plugin-image"

export type Tag = string
export type Category = string
export type Slug = string

export type CategorySummary = {
  category: Category
  count: number
}

export type Post = {
  slug: Slug
  title: string
  description: string
  date: Dayjs
  thumbnail: IGatsbyImageData | undefined
  draft: boolean
}

export type BlogPost = {
  __typename: "BlogPost"
  category: Category
  tags: Tag[]
} & Post

export type WorkPost = {
  __typename: "WorkPost"
} & Post

export type AboutPost = {
  __typename: "AboutPost"
} & Post

export type FeedSiteName = `Zenn` | `Qiita`

export type FeedPost = {
  __typename: "FeedPost"
  siteName: FeedSiteName
} & Post

export type Heading = {
  tag: `h2` | `h3`
  id: string
  title: string
}

export type Detail<T> = T & {
  body: string
  headings: Heading[]
  postUrl: string | undefined
  ogtImageUrl: string | undefined
}

export type PostTableOfContent = {
  url: string
  title: string
  items?: PostTableOfContent[]
}
