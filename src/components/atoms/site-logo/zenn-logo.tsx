import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Image from "gatsby-image"

import type { ZennLogoQuery } from "@graphql-types"
import { toFluidImage } from "@gateways/image"

const query = graphql`
  query ZennLogo {
    file(absolutePath: { regex: "/external-sites/zenn-logo/" }) {
      childImageSharp {
        fluid(maxHeight: 90, traceSVG: { background: "#ffffff" }) {
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

interface ZennLogoProps {
  className?: string
  imgStyle: {
    height: string
    width: string
  }
}

export const ZennLogo: React.FC<ZennLogoProps> = ({
  className,
  imgStyle,
}: ZennLogoProps) => {
  const { file } = useStaticQuery<ZennLogoQuery>(query)
  const logoImage = toFluidImage(file?.childImageSharp?.fluid)

  return typeof logoImage !== `undefined` ? (
    <Image fluid={logoImage} className={className} imgStyle={imgStyle} />
  ) : (
    <div className={className} style={imgStyle} />
  )
}
