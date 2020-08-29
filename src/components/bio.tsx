import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

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
    <div>
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
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
