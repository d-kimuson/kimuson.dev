import { FixedObject, FluidObject } from "gatsby-image"

import { ImageSharpFixed, ImageSharpFluid } from "@graphql-types"

function toArg<T>(prop: T | null | undefined): T | undefined {
  return prop === null ? undefined : prop
}

export function toGatsbyImageFixedArg(
  image: Pick<
    ImageSharpFixed,
    | "width"
    | "height"
    | "src"
    | "srcSet"
    | "base64"
    | "tracedSVG"
    | "srcWebp"
    | "srcSetWebp"
  >,
  media?: string
): FixedObject {
  return {
    width: image.width,
    height: image.height,
    src: image.src,
    srcSet: image.srcSet,
    // T | null | undefined
    base64: toArg(image.base64),
    tracedSVG: toArg(image.tracedSVG),
    srcWebp: toArg(image.srcWebp),
    srcSetWebp: toArg(image.srcSetWebp),
    media: media,
  }
}

export function toGatsbyImageFluidArg(
  image: Pick<
    ImageSharpFluid,
    | "aspectRatio"
    | "src"
    | "srcSet"
    | "sizes"
    | "base64"
    | "tracedSVG"
    | "srcWebp"
    | "srcSetWebp"
  >,
  media?: string
): FluidObject {
  return {
    aspectRatio: image.aspectRatio,
    src: image.src,
    srcSet: image.srcSet,
    sizes: image.sizes,
    // T | null | undefined
    base64: toArg(image.base64),
    tracedSVG: toArg(image.tracedSVG),
    srcWebp: toArg(image.srcWebp),
    srcSetWebp: toArg(image.srcSetWebp),
    media: media,
  }
}
