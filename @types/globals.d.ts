interface Post {
  slug: string
  title: string
  description: string
  date: string
  thumbnail: FluidImage | undefined
  draft: boolean
}

interface BlogPost extends Post {
  category: string
  tags: string[]
}

type WorkPost = Post

interface CategorySummary {
  name: string
  count: number
}
