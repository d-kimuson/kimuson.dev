import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-solid-svg-icons"

import { PopularCategoriesQuery } from "@graphql-types"
import { CategorySummary } from "@declaration"
import CategoryList from "../molecules/category-list"
import { processDraftPostList } from "@funcs/post"

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
  const data = useStaticQuery<PopularCategoriesQuery>(query)
  const blogPostSummaries = processDraftPostList(
    data.allMdx.edges.map(e => ({
      category: e.node.frontmatter.category,
      draft: e.node.frontmatter.draft || false,
    }))
  )
  const categories: CategorySummary[] = []
  for (const blogPost of blogPostSummaries) {
    const categoryName = blogPost.category
    if (!categoryName) continue

    const targetCategorySummary = categories.find(
      node => node.name === categoryName
    )

    if (typeof categoryName === `string`) {
      if (typeof targetCategorySummary === `undefined`) {
        categories.push({
          name: categoryName,
          count: 1,
        })
      } else {
        targetCategorySummary.count = targetCategorySummary.count + 1
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
