import React, { memo } from "react"
import { GatsbySeo, OpenGraphImages } from "gatsby-plugin-next-seo"
import { useStaticQuery, graphql } from "gatsby"

import type { HeadQuery } from "@graphql-types"
import { toBlogPostLink } from "~/service/presenters/links"

const query = graphql`
  query Head {
    site {
      siteMetadata {
        title
        description
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`

interface HeadProps {
  title?: string // TOPページのみ不要
  description?: string // TOPページのみ不要
  imageUrl?: string
  slug?: string // TOPページのみ不要
}

const Component: React.VFC<HeadProps> = ({
  title,
  description,
  imageUrl,
  slug,
}: HeadProps) => {
  const { site } = useStaticQuery<HeadQuery>(query)
  const siteTitle = site?.siteMetadata?.title || ``
  const siteDescription = site?.siteMetadata?.description || ``
  const siteUrl = site?.siteMetadata?.siteUrl || ``

  const pageTitle =
    typeof title === `undefined` ? siteTitle : `${title} | ${siteTitle}`

  const pageDescription =
    typeof description === `undefined` ? siteDescription : description

  const siteDomain = siteUrl.split(`//`)[1].split(`/`)[0]
  const pageUrl = `https://${siteDomain}${toBlogPostLink(slug || ``)}`

  let ogImages: OpenGraphImages[] | undefined
  if (typeof imageUrl === `string`) {
    ogImages = [
      {
        url: siteUrl + imageUrl,
      },
    ]
  } else {
    ogImages = undefined
  }

  return (
    <GatsbySeo
      title={pageTitle}
      description={pageDescription}
      language="ja"
      openGraph={{
        url: pageUrl,
        title: pageTitle,
        description: pageDescription,
        images: ogImages,
        site_name: siteTitle,
      }}
    />
  )
}

export const Head = memo(Component)
