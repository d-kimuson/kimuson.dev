import { faFolder } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import type { PopularCategoriesQuery } from "@graphql-types"
import { CategoryList } from "~/features/blog/components/category-list"
import { toCategorySummaryList } from "~/features/blog/services/category"
import * as styles from "../layout.module.scss"

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

export const PopularCategories: React.FC = () => {
  const data = useStaticQuery<PopularCategoriesQuery>(query)
  const categories = toCategorySummaryList(data.allMdx.edges)

  return (
    <>
      <section className={classNames("m-card", styles.sidebarWidth)}>
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
