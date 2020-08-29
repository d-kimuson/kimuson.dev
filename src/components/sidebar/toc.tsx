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
  const headings: Heading[] = [];

  console.log(htmlAst);

  const targetTags = htmlAst.children
    .filter(ast => ast.type === `element`)
    .filter(ast => [`h2`, `h3`].includes(ast.tagName || ``))

  let tag;
  for (tag of targetTags) {
    const id = tag.properties?.id

    if (typeof tag.tagName === `string` && typeof id === `string`) {
      headings.push({
        tag: tag.tagName,
        id: tag.properties?.id
      })
    }
  }

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
