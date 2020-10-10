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

export interface Article {
  slug: string
  title: string
  description: string
  date: string
  thumbnail: FluidImage | undefined
  draft: boolean
  category: string
  tags: string[]
}

export interface CategoryListNode {
  name: string
  count: number
}
