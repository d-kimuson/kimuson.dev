import React from "react"
import { Link } from "gatsby"

// @ts-ignore
import styles from "./layout.module.scss"

const getCategoryLink = (category: string): string => `/categories/${category}`

const categoryNavs = [`フロントエンド`, `ブログ`].map(category => ({
  to: getCategoryLink(category),
  text: category,
}))

const navRoutes = [
  {
    to: `/`,
    text: `TOP`,
  },
].concat(categoryNavs)

const Navigation: React.FC = () => {
  return (
    <nav role="navigation" className={styles.headerNav}>
      <ul className={styles.navLinkList}>
        {navRoutes.map(route => (
          <li key={route.text}>
            <Link to={route.to} className="m-remove-a-decoration">
              {route.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
