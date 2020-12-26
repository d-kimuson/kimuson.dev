import React from "react"
import { GatsbySeo, OpenGraphImages } from "gatsby-plugin-next-seo"
import { useStaticQuery, graphql } from "gatsby"

import type { HeadQuery } from "@graphql-types"
import { toBlogPostLink } from "@presenters/links"

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

export const Head: React.FC<HeadProps> = ({
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

  console.log(pageTitle, pageDescription, pageUrl)
  console.log(
    `title: ${pageTitle}` +
      `description: ${pageDescription}` +
      `url: ${pageUrl}`
  )

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
        // eslint のルールと引数定義が競合するので無効にする
        // eslint-disable-next-line @typescript-eslint/camelcase
        site_name: siteTitle,
      }}
    />
  )
}
