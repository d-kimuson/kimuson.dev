import React from "react"
import OtherLogo from "./other-logo"
import QiitaLogo from "./qiita-logo"
import ZennLogo from "./zenn-logo"

type SiteLogoProps = {
  siteName: "Zenn" | "Qiita" | "other"
  className?: string | undefined
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ siteName, className }) => {
  switch (siteName) {
    case "Zenn":
      return <ZennLogo className={className} />
    case "Qiita":
      return <QiitaLogo className={className} />
    case "other":
      return <OtherLogo className={className} />
    default: {
      const _coverCheck: never = siteName
      throw new TypeError()
    }
  }
}
