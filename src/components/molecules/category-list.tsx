import React from "react"
import { Link } from "gatsby"

import { getCategoryLink } from "@funcs/links"

// @ts-ignore
import styles from "./category-list.module.scss"

interface CategoryListProps {
  categories: string[]
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
}: CategoryListProps) => (
  <ul className={styles.categoryList}>
    {categories.map(category => (
      <li key={category} className={styles.category}>
        <Link to={getCategoryLink(category)} className="m-remove-a-decoration">
          {category}
        </Link>
      </li>
    ))}
  </ul>
)

export default CategoryList
