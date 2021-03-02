import type { ExcludeNullProps } from "types/utils"
import type { ImageSharpFixed, ImageSharpFluid } from "@graphql-types"

export type RawFixedImage = Pick<
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

export type RawFluidImage = Pick<
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

export type FixedImage = ExcludeNullProps<RawFixedImage>
export type FluidImage = ExcludeNullProps<RawFluidImage>
