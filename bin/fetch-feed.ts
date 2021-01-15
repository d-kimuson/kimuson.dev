import { writePosts } from "@utils/feed"

(async (): Promise<void> => {
  await writePosts()
})()
