import React, { memo } from "react"
import { Link } from "~/components/common/link"
import type { CategorySummary } from "~/service/entities/post"
import { toCategoryLink } from "~/service/presenters/links"
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
