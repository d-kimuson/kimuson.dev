import { pipe } from "ramda"

import type { FluidImage, FixedImage } from "@entities/image"
import type { RawFluidImage, RawFixedImage } from "@entities/image"
import { excludeNull, excludeNullProps } from "@utils/index"

export function toFluidImage(
  fluid: RawFluidImage | null | undefined
): FluidImage | undefined {
  return pipe(excludeNull, excludeNullProps)(fluid)
}

export function toFixedImage(
  fixed: RawFixedImage | null | undefined
): FixedImage | undefined {
  return pipe(excludeNull, excludeNullProps)(fixed)
}
