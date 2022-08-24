import { useStaticQuery, graphql } from "gatsby"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import React from "react"
import type { HeadQuery } from "@graphql-types"
import type { OpenGraphImages } from "gatsby-plugin-next-seo"
import { toBlogPostLink } from "~/service/links"

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

type HeadProps = {
  title?: string | undefined // TOPページのみ不要
  description?: string | undefined // TOPページのみ不要
  imageUrl?: string | undefined
  slug?: string | undefined // TOPページのみ不要
}

export const Head: React.FC<HeadProps> = ({
  title,
  description,
  imageUrl,
  slug,
}) => {
  const { site } = useStaticQuery<HeadQuery>(query)
  const siteTitle = site?.siteMetadata?.title ?? ``
  const siteDescription = site?.siteMetadata?.description ?? ``
  const siteUrl = site?.siteMetadata?.siteUrl ?? ``

  const pageTitle =
    typeof title === `undefined` ? siteTitle : `${title} | ${siteTitle}`

  const pageDescription =
    typeof description === `undefined` ? siteDescription : description

  const siteDomain = siteUrl.split(`//`)[1]?.split(`/`)[0]
  const pageUrl = `https://${siteDomain}${toBlogPostLink(slug ?? ``)}`

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
        images: ogImages ?? [],
        site_name: siteTitle,
      }}
    />
  )
}
