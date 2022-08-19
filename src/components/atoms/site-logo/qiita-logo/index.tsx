import { StaticImage } from "gatsby-plugin-image"

type QiitaLogoProps = {
  className?: string | undefined
}

const QiitaLogo: React.FC<QiitaLogoProps> = ({ className }) => {
  return (
    <StaticImage
      src="./qiita-logo.png"
      alt="Qiita"
      height={90}
      width={120}
      layout="fixed"
      imgClassName={className ?? ""}
    />
  )
}

export default QiitaLogo
