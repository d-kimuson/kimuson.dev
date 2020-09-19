import React from "react"
import { Link } from "gatsby"

import { HtmlAst } from "@declaration"
// @ts-ignore
import styles from "./sidebar.module.scss"

interface Heading {
  tag: string
  id: string
  value: string
}

interface TocProps {
  htmlAst: HtmlAst
}

const Toc: React.FC<TocProps> = ({ htmlAst }: TocProps) => {
  const headings = htmlAst.children
    .filter(node => node.type === `element`)
    .filter(node => [`h2`, `h3`].includes(node.tagName || ``))
    .map(node => ({
      tag: node.tagName,
      id: node.properties?.id,
      value: node.children.find(item => item.type == `text`)?.value,
    }))
    .filter(
      (h): h is Heading => typeof (h.tag && h.id && h.value) !== `undefined`
    )

  return (
    <section className={`${styles.tocWrapper} m-card`}>
      <h1 className={styles.tocTitle}>この記事の見出し</h1>
      <ul className={styles.toc}>
        {headings.map(h => (
          <li key={h.id} className={`toc-${h.tag}`}>
            <Link to={`#${h.id}`}>{h.value}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Toc
