import React from "react"
import { Link } from "gatsby"

import { getCategoryLink } from "@funcs/links"
// @ts-ignore
import styles from "./navigation.module.scss"

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

interface NavigationProps {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({
  className,
}: NavigationProps) => {
  return (
    <nav role="navigation" className={className ? className : ``}>
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
