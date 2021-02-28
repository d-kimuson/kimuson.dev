import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRss } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

// @ts-ignore
import styles from "./navigation.module.scss"

const navRoutes = [
  {
    to: `/`,
    text: `TOP`,
  },
  {
    to: `/blog/`,
    text: `Blog / Search`,
  },
  {
    to: `/work/`,
    text: `Work`,
  },
  {
    to: `/about/`,
    text: `About`,
  },
]

const navIcons = [
  {
    to: `https://github.com/d-kimuson/kimuson.dev`,
    icon: faGithub,
  },
  {
    to: `/rss.xml`,
    icon: faRss,
  },
]

interface NavigationProps {
  id?: string
  className?: string
  "aria-hidden"?: boolean
}

export const Navigation: React.FC<NavigationProps> = (
  props: NavigationProps
) => {
  const { className, id } = props
  return (
    <nav
      id={id ? id : ``}
      role="navigation"
      className={className ? className : ``}
      aria-hidden={props[`aria-hidden`]}
    >
      <ul className={styles.navLinkList}>
        {navRoutes.map((route) => (
          <li key={route.to}>
            <Link
              to={route.to}
              className={`m-un-selectable m-remove-a-decoration ${styles.navLink}`}
            >
              {route.text}
            </Link>
          </li>
        ))}
        {navIcons.map((link) => (
          <li key={link.to}>
            <a
              href={link.to}
              className={`m-remove-a-decoration ${styles.navLink}`}
            >
              <FontAwesomeIcon icon={link.icon} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
