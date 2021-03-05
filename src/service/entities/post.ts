import type { Dayjs } from "dayjs"
import type { IGatsbyImageData } from "gatsby-plugin-image"

export type Tag = string
export type Category = string
export type Slug = string

export interface CategorySummary {
  category: Category
  count: number
}

export interface Post {
  slug: Slug
  title: string
  description: string
  date: Dayjs
  thumbnail: IGatsbyImageData | undefined
  draft: boolean
}

export interface BlogPost extends Post {
  __typename: "BlogPost"
  category: Category
  tags: Tag[]
}

export interface WorkPost extends Post {
  __typename: "WorkPost"
}

export interface AboutPost extends Post {
  __typename: "AboutPost"
}

export type FeedSiteName = `Zenn` | `Qiita`

export interface FeedPost extends Post {
  __typename: "FeedPost"
  siteName: FeedSiteName
}

export interface Heading {
  tag: `h2` | `h3`
  id: string
  title: string
}

export type Detail<T> = T & {
  body: string
  headings: Heading[]
  postUrl?: string
  ogtImageUrl: string | undefined
}
