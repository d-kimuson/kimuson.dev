import type { Dayjs } from "dayjs"
import type { FluidImage } from "@entities/image"

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
  thumbnail: FluidImage | undefined
  draft: boolean
}

export interface BlogPost extends Post {
  category: Category
  tags: Tag[]
}

export type WorkPost = Post
export type AboutPost = Post

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
