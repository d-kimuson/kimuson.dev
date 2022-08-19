import fs from "fs"
import type { FeedPost } from "./types"
import { fetchAllPosts } from "./fetch"

const jsonPath = `./content/feed-posts.json`

export async function writePosts(): Promise<void> {
  const posts = await fetchAllPosts()
  fs.writeFileSync(jsonPath, JSON.stringify(posts))
}

export function readPosts(): FeedPost[] | undefined {
  const raw = fs.readFileSync(jsonPath, `utf-8`)
  return JSON.parse(raw) as FeedPost[] | undefined
}
