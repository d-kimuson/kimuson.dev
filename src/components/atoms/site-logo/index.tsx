import React, { memo, useMemo } from "react"
import loadable from "loadable-components"

const QiitaLogo = loadable(async () => {
  const { QiitaLogo } = await import(`./qiita-logo`)
  return QiitaLogo
})

const ZennLogo = loadable(async () => {
  const { ZennLogo } = await import(`./zenn-logo`)
  return ZennLogo
})

interface SiteLogoProps {
  siteName: "Zenn" | "Qiita"
  className?: string
  imgStyle: {
    height: number
    width: number
  }
}

const Component: React.VFC<SiteLogoProps> = ({
  siteName,
  className,
  imgStyle,
}: SiteLogoProps) => {
  const props = useMemo(
    () => ({
      className,
      imgStyle,
    }),
    []
  )
  const Logo = siteName === `Zenn` ? ZennLogo : QiitaLogo

  return <Logo {...props} />
}

export const SiteLogo = memo(Component)
