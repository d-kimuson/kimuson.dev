import { FixedObject, FluidObject } from "gatsby-image"
import { FixedImage, FluidImage } from "@declaration"

import { toArg } from "@funcs/type"

export function toGatsbyImageFixedArg(
  image: FixedImage,
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
  image: FluidImage,
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
