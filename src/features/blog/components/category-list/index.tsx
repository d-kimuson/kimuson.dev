import React, { memo } from "react"
import { Link } from "~/functional/link"
import { toCategoryLink } from "~/service/links"
import type { CategorySummary } from "~/types/post"
import * as styles from "./category-list.module.scss"

type CategoryListProps = {
  categoryList: CategorySummary[]
}

const Component: React.FC<CategoryListProps> = ({
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
