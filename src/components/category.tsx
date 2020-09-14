import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-solid-svg-icons"

import styles from "./category.module.scss"

interface CategoryProps {
  category: string
  isLink: boolean
}

interface CategoryInnerProps {
  category: string
}

const CategoryInner: React.FC<CategoryInnerProps> = ({
  category,
}: CategoryInnerProps) => (
  <div className={styles.category}>
    <FontAwesomeIcon icon={faFolder} />
    {category}
  </div>
)

const Category: React.FC<CategoryProps> = ({
  category,
  isLink,
}: CategoryProps) =>
  isLink ? (
    <Link to={`/categories/${category}`} className="m-remove-a-decoration">
      <CategoryInner category={category} />
    </Link>
  ) : (
    <span>
      <CategoryInner category={category} />
    </span>
  )

export default Category
