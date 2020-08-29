import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
import { BioQuery } from "../../types/graphql-types"

const query = graphql`
query Bio {
  avatar: file(absolutePath: { regex: "/gatsby-icon.png/" }) {
    childImageSharp {
      fixed(width: 50, height: 50) {
        ...GatsbyImageSharpFixed
      }
    }
  }
  site {
    siteMetadata {
      author {
        name
        summary
      }
      social {
        twitter
      }
    }
  }
}
`

const Bio: React.FC = () => {
  const data: BioQuery = useStaticQuery(query)
  const { author, social } = data.site.siteMetadata

  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        Written by <strong>{author.name}</strong> {author.summary}
        {` `}
        <a href={`https://twitter.com/${social.twitter}`}>
          You should follow him on Twitter
        </a>
      </p>
    </div>
  )
}

export default Bio
