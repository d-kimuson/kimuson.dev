import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faRss } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "~/functional/link"
import * as styles from "./navigation.module.scss"

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

type NavigationProps = {
  id?: string
  className?: string | undefined
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
