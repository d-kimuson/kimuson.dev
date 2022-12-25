import fs from "fs"
import type { FeedPost } from "./types"
import { fetchAllPosts } from "./fetch"

const jsonPath = `./content/feed-posts.json`

const mfacArticles = [
  {
    title:
      "TS 4.9 satisfies operator を使って React Router のナビゲーションを型安全にしてみる",
    link: "https://tech.mobilefactory.jp/entry/2022/12/01/000000",
  },
  {
    title:
      "「メリハリのある TypeScript」で運用しながら型安全性を高めやすい TypeScript リプレースを行う",
    link: "https://tech.mobilefactory.jp/entry/2022/01/17/103000",
  },
  {
    title:
      "外からやってくる値から TypeScript の型を守るライブラリ・ツールまとめ",
    link: "https://tech.mobilefactory.jp/entry/2021/12/10/000000",
  },
  {
    title:
      "VSCode で TypeScript の交差型のプロパティを省略せずに見れるようにする",
    link: "https://tech.mobilefactory.jp/entry/2021/12/02/000000",
  },
  {
    title:
      "CommonJS と ESModules が混在している環境で、lodash を lodash-es に置き換え、バンドルサイズを減らす",
    link: "https://tech.mobilefactory.jp/entry/2021/10/14/100000",
  },
].map(({ title, link }): FeedPost => {
  const parsed = link
    .split("entry")[1]
    ?.split("/")
    .filter((text) => text !== "")
  if (parsed === undefined || parsed.length !== 4) {
    throw new Error("UnExpected")
  }
  const [year, month, day, time] = parsed

  return {
    title,
    link,
    isoDate: `${year}-${month}-${day}T${time?.slice(0, 2)}:${time?.slice(
      2,
      4
    )}:${time?.slice(4, 6)}`,
    site: {
      name: "other",
      feedUrl: "https://tech.mobilefactory.jp/feed",
    },
  }
})

export async function writePosts(): Promise<void> {
  const posts = await fetchAllPosts().then((posts) =>
    posts.concat(mfacArticles)
  )
  fs.writeFileSync(jsonPath, JSON.stringify(posts))
}

export function readPosts(): FeedPost[] | undefined {
  const raw = fs.readFileSync(jsonPath, `utf-8`)
  return JSON.parse(raw) as FeedPost[] | undefined
}
