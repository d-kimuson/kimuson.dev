import React from "react"
import { Link } from "gatsby"

import { HtmlAst } from "../../../types/declaration"
import styles from "./sidebar.module.scss"

interface Heading {
  tag: string;
  id: string;
}

interface TocProps {
  htmlAst: HtmlAst;
}

const Toc: React.FC<TocProps> = ({ htmlAst }: TocProps) => {
  const headings = htmlAst.children
    .filter(node => node.type === `element`)
    .filter(node => [`h2`, `h3`].includes(node.tagName || ``))
    .map(node => ({
      tag: node.tagName,
      id: node.properties?.id
    }))
    .filter((h): h is Heading => typeof (h.tag && h.id) !== `undefined`)

  return (
    <section className={styles.tocWrapper}>
      <h1 className={styles.tocTitle}>この記事の見出し</h1>
      <ul className={styles.toc}>
        {headings.map((h) => (
          <li key={h.id} className={`toc-${h.tag}`}>
            <Link to={`#${h.id}`}>{h.id}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Toc
