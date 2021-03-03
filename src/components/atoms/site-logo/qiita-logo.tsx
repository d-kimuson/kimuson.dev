import React, { memo } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Image from "gatsby-image"

import type { QiitaLogoQuery } from "@graphql-types"
import { toFluidImage } from "~/service/gateways/image"

const query = graphql`
  query QiitaLogo {
    file(absolutePath: { regex: "/external-sites/qiita-logo/" }) {
      childImageSharp {
        fluid(maxHeight: 90, traceSVG: { background: "#55C500" }) {
          aspectRatio
          base64
          sizes
          src
          srcSetWebp
          srcSet
          tracedSVG
        }
      }
    }
  }
`

interface QiitaLogoProps {
  className?: string
  imgStyle: {
    height: string
    width: string
  }
}

const Component: React.VFC<QiitaLogoProps> = ({
  className,
  imgStyle,
}: QiitaLogoProps) => {
  const { file } = useStaticQuery<QiitaLogoQuery>(query)
  const logoImage = toFluidImage(file?.childImageSharp?.fluid)

  return typeof logoImage !== `undefined` ? (
    <Image fluid={logoImage} className={className} imgStyle={imgStyle} />
  ) : (
    <div className={className} style={imgStyle} />
  )
}

export const QiitaLogo = memo(Component)
