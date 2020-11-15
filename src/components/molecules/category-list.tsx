import React from "react"
import { Link } from "gatsby"

import { CategorySummary } from "@declaration"
import { getCategoryLink } from "@funcs/links"
// @ts-ignore
import styles from "./category-list.module.scss"

interface CategoryListProps {
  categoryList: CategorySummary[]
}

const CategoryList: React.FC<CategoryListProps> = ({
  categoryList,
}: CategoryListProps) => (
  <ul className={styles.categoryList}>
    {categoryList.map(category => (
      <li key={category.name} className={styles.category}>
        <Link
          to={getCategoryLink(category.name)}
          className="m-remove-a-decoration"
        >
          {category.name} ({category.count})
        </Link>
      </li>
    ))}
  </ul>
)

export default CategoryList
