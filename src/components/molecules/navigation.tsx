import React from "react"
import { Link } from "gatsby"

// @ts-ignore
import styles from "./navigation.module.scss"

const navRoutes = [
  {
    to: `/`,
    text: `TOP`,
  },
  {
    to: `/blog/`,
    text: `Blog`,
  },
  {
    to: `/about/`,
    text: `About`,
  },
]

interface NavigationProps {
  id?: string
  className?: string
  "aria-hidden"?: boolean
}

const Navigation: React.FC<NavigationProps> = (props: NavigationProps) => {
  const { className, id } = props
  return (
    <nav
      id={id ? id : ``}
      role="navigation"
      className={className ? className : ``}
      aria-hidden={props[`aria-hidden`]}
    >
      <ul className={styles.navLinkList}>
        {navRoutes.map(route => (
          <li key={route.to}>
            <Link
              to={route.to}
              className={`m-remove-a-decoration ${styles.navLink}`}
            >
              {route.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation