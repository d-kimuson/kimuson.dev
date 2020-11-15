import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-solid-svg-icons"

import { PopularCategoriesQuery, MdxEdge } from "@graphql-types"
import { CategoryListNode } from "@declaration"
import CategoryList from "../molecules/category-list"
import { filterDraft } from "@funcs/article"

const query = graphql`
  query PopularCategories {
    allMdx {
      edges {
        node {
          frontmatter {
            category
            draft
          }
        }
      }
    }
  }
`

const PopularCategories: React.FC = () => {
  const data: PopularCategoriesQuery = useStaticQuery(query)
  const edges = data.allMdx.edges
    .filter((e): e is MdxEdge => typeof e !== `undefined`)
    .filter(filterDraft)

  const categories: CategoryListNode[] = []
  for (const edge of edges) {
    const category = edge.node.frontmatter?.category
    const target = categories.find(node => node.name === category)
    if (typeof category === `string`) {
      if (typeof target === `undefined`) {
        categories.push({
          name: category,
          count: 1,
        })
      } else {
        target.count = target.count + 1
      }
    }
  }

  return (
    <>
      <section className={`m-card l-sidebar-width`}>
        <h1 className="m-card__title">
          <FontAwesomeIcon icon={faFolder} />
          CATEGORIES
        </h1>
        <div className={`m-card__content`}>
          <CategoryList
            categoryList={categories
              .sort((a, b) => b.count - a.count)
              .slice(0, 12)}
          />
        </div>
      </section>
    </>
  )
}

export default PopularCategories
