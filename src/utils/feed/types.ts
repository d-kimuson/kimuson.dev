export interface FeedItem {
  title: string
  link: string
  isoDate: string
}

export interface FeedSite {
  name: string
  feedUrl: string
}

export interface FeedPost {
  title: string
  link: string
  isoDate: string
  site: FeedSite
}
