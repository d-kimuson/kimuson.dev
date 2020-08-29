import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

import { HeadQuery } from "../../types/graphql-types"

const query = graphql`
query Head {
  site {
    siteMetadata {
      title
      description
      social {
        twitter
      }
    }
  }
}
`

interface HeadProps {
  title?: string;    // TOPページのみ不要
  description?: string;  // TOPページのみ不要
  meta?: {
    name: string;
    content: string;
  }[];
}

const Head: React.FC<HeadProps> = ({
  title,
  description,
  meta = []
}: HeadProps) => {
  const { site }: HeadQuery = useStaticQuery(query)
  // == 空文字だと困るのでテストで落とす ==
  const siteTitle = site?.siteMetadata?.title || ``;
  const siteDescription = site?.siteMetadata?.description || ``;
  // =================================

  const pageTitle = typeof title === `undefined`
    ? siteTitle
    : `${title} | ${siteTitle}`

  const pageDescription = typeof description === `undefined`
    ? siteDescription
    : description

  return (
    <Helmet
      htmlAttributes={{
        lang: `ja`,
      }}
      title={pageTitle}
      meta={[
        {
          name: `description`,
          content: pageDescription,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site?.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: pageTitle,
        },
        {
          name: `twitter:description`,
          content: pageDescription,
        },
      ].concat(meta)}
    />
  )
}

export default Head
