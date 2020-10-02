import React from "react"
import { Link } from "gatsby"

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
        <Link to={`/categories/${category}`} className="m-remove-a-decoration">
          {category}
        </Link>
      </li>
    ))}
  </ul>
)

export default CategoryList
