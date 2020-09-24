import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTag } from "@fortawesome/free-solid-svg-icons"
import { faFolder } from "@fortawesome/free-solid-svg-icons"

import { CommonSidebarQuery, MarkdownRemarkEdge } from "@graphql-types"
import CategoryList from "../category-list"
import TagList from "../tag-list"
import { filterDraft } from "../../utils/article"

const query = graphql`
  query CommonSidebar {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            category
            tags
            draft
          }
        }
      }
    }
  }
`

const CommonSidebar: React.FC = () => {
  const data: CommonSidebarQuery = useStaticQuery(query)
  const edges = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
    .filter(filterDraft)

  const categories = edges
    .map(e => e.node.frontmatter?.category)
    .filter((c): c is string => typeof c !== `undefined`)

  const tags = Array.from(
    new Set(
      edges
        .flatMap(e => e.node.frontmatter?.tags)
        .filter((c): c is string => typeof c !== `undefined`)
    )
  )

  return (
    <>
      <section className="m-card l-sidebar-width">
        <h1 className="m-card__title">
          <FontAwesomeIcon icon={faFolder} />
          ALL CATEGORIES
        </h1>
        <div className="m-card__content">
          <CategoryList categories={categories} />
        </div>
      </section>
      <section className="m-card l-sidebar-width">
        <h1 className="m-card__title">
          <FontAwesomeIcon icon={faTag} style={{ transform: `scale(0.9)` }} />
          ALL TAGS
        </h1>
        <div className="m-card__content">
          <TagList tags={tags} isLink={true} />
        </div>
      </section>
    </>
  )
}

export default CommonSidebar
