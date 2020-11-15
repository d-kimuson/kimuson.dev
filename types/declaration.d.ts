import { ImageSharpFixed, ImageSharpFluid } from "@graphql-types"

export type FixedImage = Pick<
  ImageSharpFixed,
  | "width"
  | "height"
  | "src"
  | "srcSet"
  | "base64"
  | "tracedSVG"
  | "srcWebp"
  | "srcSetWebp"
>

export type FluidImage = Pick<
  ImageSharpFluid,
  | "aspectRatio"
  | "src"
  | "srcSet"
  | "sizes"
  | "base64"
  | "tracedSVG"
  | "srcWebp"
  | "srcSetWebp"
>

export interface HtmlAst {
  type: string
  value?: string
  tagName?: string
  properties?: {
    id?: string
    class?: string
  }
  children: HtmlAst[]
}

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  thumbnail: FluidImage | undefined
  draft: boolean
}

export interface BlogPost extends Post {
  category: string
  tags: string[]
}

export type WorkPost = Post

export interface CategorySummary {
  name: string
  count: number
}
