import type { FeedSiteName } from "~/service/entities/post"

export interface FeedItem {
  title: string
  link: string
  isoDate: string
}

export interface FeedSite {
  name: FeedSiteName
  feedUrl: string
}

export interface FeedPost {
  title: string
  link: string
  isoDate: string
  site: FeedSite
}
