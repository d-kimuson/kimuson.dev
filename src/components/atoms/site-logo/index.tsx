import QiitaLogo from "./qiita-logo"
import ZennLogo from "./zenn-logo"

type SiteLogoProps = {
  siteName: "Zenn" | "Qiita"
  className?: string | undefined
}

export const SiteLogo: React.VFC<SiteLogoProps> = ({ siteName, className }) => {
  switch (siteName) {
    case "Zenn":
      return <ZennLogo className={className} />
    case "Qiita":
      return <QiitaLogo className={className} />
    default: {
      const _coverCheck: never = siteName
      throw new TypeError()
    }
  }
}
