import React from "react"
import loadable from "loadable-components"

const QiitaLogo = loadable(async () => {
  const { QiitaLogo } = await import(
    `./qiita-logo`
  )
  return QiitaLogo
})

const ZennLogo = loadable(async () => {
  const { ZennLogo } = await import(
    `./zenn-logo`
  )
  return ZennLogo
})

interface SiteLogoProps {
  siteName: 'Zenn' | 'Qiita'
  className?: string
  imgStyle: {
    height: string,
    width: string
  }
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ siteName, className, imgStyle }: SiteLogoProps) => {
  const props = {
    className,
    imgStyle
  }
  const Logo = siteName === `Zenn` ? ZennLogo : QiitaLogo

  return <Logo {...props}/>
}
