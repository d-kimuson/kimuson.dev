import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import type { FooterQuery } from "@graphql-types"
import { Link } from "~/functional/link"
import * as styles from "./footer.module.scss"

const query = graphql`
  query Footer {
    site {
      siteMetadata {
        title
      }
    }
  }
`

type FooterProps = {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
  const data = useStaticQuery<FooterQuery>(query)
  const siteTitle = data.site?.siteMetadata?.title

  return (
    <footer
      className={`${styles.footer} ${
        typeof className === `string` ? className : ``
      }`}
    >
      {typeof siteTitle === `string` ? (
        <p>
          © 2020-{new Date().getFullYear()} {siteTitle} All Right Reserved.
        </p>
      ) : null}
      <ul className={styles.footerLinks}>
        <li>
          <Link to="/blog/" className="m-remove-a-decoration">
            記事一覧
          </Link>
        </li>
        <li>
          <Link to="/about/" className="m-remove-a-decoration">
            このブログについて
          </Link>
        </li>
        <li>
          <a href="/sitemap.xml" className="m-remove-a-decoration">
            サイトマップ
          </a>
        </li>
      </ul>
    </footer>
  )
}