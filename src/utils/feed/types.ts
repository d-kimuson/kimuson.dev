import type { FeedSiteName } from "~/types/post"

export type FeedItem = {
  title: string
  link: string
  isoDate: string
}

export type FeedSite = {
  name: FeedSiteName
  feedUrl: string
}

export type FeedPost = {
  title: string
  link: string
  isoDate: string
  site: FeedSite
}
