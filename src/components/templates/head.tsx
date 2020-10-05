import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { useStaticQuery, graphql } from "gatsby"

import { HeadQuery } from "@graphql-types"
import { getArticleLink } from "@funcs/links"

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
  slug?: string // TOPページのみ不要
}

const Head: React.FC<HeadProps> = ({ title, description, slug }: HeadProps) => {
  const { site }: HeadQuery = useStaticQuery(query)
  const siteTitle = site?.siteMetadata?.title || ``
  const siteDescription = site?.siteMetadata?.description || ``
  const siteUrl = site?.siteMetadata?.siteUrl || ``

  const pageTitle =
    typeof title === `undefined` ? siteTitle : `${title} | ${siteTitle}`

  const pageDescription =
    typeof description === `undefined` ? siteDescription : description

  const siteDomain = siteUrl.split(`//`)[1].split(`/`)[0]

  const pageUrl =
    typeof siteUrl === `string`
      ? `https://${siteDomain}${getArticleLink(slug || ``)}`
      : undefined

  console.log(pageTitle, pageDescription, pageUrl)
  console.log(
    `title: ${pageTitle}` +
      `description: ${pageDescription}` +
      `url: ${pageUrl}`
  )

  return (
    <GatsbySeo
      title={pageTitle}
      description={pageDescription}
      language="ja"
      openGraph={{
        url: pageUrl,
        title: pageTitle,
        description: pageDescription,
        // eslint のルールと引数定義が競合するので無効にする
        // eslint-disable-next-line @typescript-eslint/camelcase
        site_name: siteTitle,
      }}
    />
  )
}

export default Head
