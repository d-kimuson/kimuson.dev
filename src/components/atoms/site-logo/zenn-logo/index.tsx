import { StaticImage } from "gatsby-plugin-image"

type ZennLogoProps = {
  className?: string | undefined
}

const ZennLogo: React.FC<ZennLogoProps> = ({ className }) => {
  return (
    <StaticImage
      src="./zenn-logo.png"
      alt="Zenn"
      layout="fixed"
      height={90}
      width={120}
      imgClassName={className ?? ""}
    />
  )
}

export default ZennLogo
