import React, { memo } from "react"
import { StaticImage } from "gatsby-plugin-image"

type ZennLogoProps = {
  className?: string
}

const Component: React.VFC<ZennLogoProps> = ({ className }: ZennLogoProps) => {
  return (
    <StaticImage
      className={className}
      src="./zenn-logo.png"
      alt="Zenn"
      layout="fixed"
      height={90}
      width={120}
    />
  )
}

export const ZennLogo = memo(Component)
