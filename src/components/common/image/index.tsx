import { GatsbyImage } from "gatsby-plugin-image"
import type { GatsbyImageProps } from "gatsby-plugin-image"

type ImageProps = Omit<GatsbyImageProps, "className"> & {
  className?: string | undefined
}

export const Image: React.FC<ImageProps> = (props) => {
  return <GatsbyImage {...(props as GatsbyImageProps)} />
}
