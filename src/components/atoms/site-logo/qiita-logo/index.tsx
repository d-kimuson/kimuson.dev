import React, { memo } from "react"
import { StaticImage } from "gatsby-plugin-image"

type QiitaLogoProps = {
  className?: string
}

const Component: React.VFC<QiitaLogoProps> = ({
  className,
}: QiitaLogoProps) => {
  return (
    <StaticImage
      className={className}
      src="./qiita-logo.png"
      alt="Qiita"
      layout="fixed"
      height={90}
      width={120}
    />
  )
}

export const QiitaLogo = memo(Component)
