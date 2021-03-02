import React from "react"
import { Link } from "gatsby"

import styles from "./category-list.module.scss"
import type { CategorySummary } from "~/service/entities/post"
import { toCategoryLink } from "~/service/presenters/links"

interface CategoryListProps {
  categoryList: CategorySummary[]
}

export const CategoryList: React.FC<CategoryListProps> = ({
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
