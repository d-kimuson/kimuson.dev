import React, { memo } from "react"
import { Link } from "gatsby"

import * as styles from "./category-list.module.scss"
import type { CategorySummary } from "~/service/entities/post"
import { toCategoryLink } from "~/service/presenters/links"

interface CategoryListProps {
  categoryList: CategorySummary[]
}

const Component: React.VFC<CategoryListProps> = ({
  categoryList,
}: CategoryListProps) => (
  <ul className={styles.categoryList}>
    {categoryList.map((categorySummary) => (
      <li key={categorySummary.category} className={styles.category}>
        <Link
          to={toCategoryLink(categorySummary.category)}
          className="m-remove-a-decoration"
        >
          {categorySummary.category} ({categorySummary.count})
        </Link>
      </li>
    ))}
  </ul>
)

export const CategoryList = memo(Component)
