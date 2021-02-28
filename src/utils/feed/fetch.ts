import Parser from "rss-parser"

import type { FeedItem, FeedPost } from "./types"
import { sites } from "./sites"

const parser = new Parser<{ items: FeedItem[] }>()

async function fetchItems(url: string): Promise<FeedItem[]> {
  const feed = await parser.parseURL(url)
  if (!feed.items?.length) return []

  return feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    isoDate: item.isoDate,
  }))
}

export async function fetchAllPosts(): Promise<FeedPost[]> {
  return (
    await Promise.all(
      sites.map(async (site) => {
        return (await fetchItems(site.feedUrl)).map((post) => ({
          ...post,
          site: site,
        }))
      })
    )
  ).flat()
}
