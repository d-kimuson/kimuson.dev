import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList } from "@fortawesome/free-solid-svg-icons"

import { MdxAst } from "@declaration"
import { toValidSlug } from "@funcs/links"
// @ts-ignore
import styles from "./toc.module.scss"

const infty = 100000
const headerHeight = 60

interface Heading {
  tag: string
  id: string
  value: string
  active: boolean
  elm?: HTMLElement
}

interface TocProps {
  mdxAst: MdxAst
}

const Toc: React.FC<TocProps> = ({ mdxAst }: TocProps) => {
  const [headings, setHeadings] = useState<Heading[]>(
    (mdxAst.children || [])
      .filter(node => node.type === `heading`)
      .filter(node => node.depth && [2, 3].includes(node.depth))
      .map(node => {
        const value = node.children?.find(item => item.type == `text`)?.value

        return {
          tag: node.depth ? `h${node.depth}` : node.depth,
          id: value ? toValidSlug(value) : value,
          active: false,
          value: value,
        }
      })
      .filter(
        (h): h is Heading => typeof (h.tag && h.id && h.value) !== `undefined`
      )
  )
  const [pageYOffset, setPageYOffset] = useState<number>(0)

  // functions
  const setHeadingTop = (heading: Heading): { top: number } & Heading => ({
    ...heading,
    top: heading.elm?.getBoundingClientRect().top || infty,
  })

  // 最初のみ呼ばれる処理
  useEffect(() => {
    // Init Heading Element
    setHeadings(
      headings.map(heading => {
        const elm = document.getElementById(heading.id)
        return {
          ...heading,
          elm: elm === null ? undefined : elm,
        }
      })
    )

    // Add Scroll Event Lister
    document.addEventListener(`scroll`, () =>
      setPageYOffset(window.pageYOffset)
    )
  }, [])

  // 画面位置の変更
  useEffect(() => {
    if (typeof headings[0]?.elm === `undefined`) return

    const activeHeading = headings
      .map(setHeadingTop)
      .filter(heading => heading.top <= headerHeight + 5)
      .slice(-1)[0]

    const activeId =
      typeof activeHeading === `undefined` ? headings[0].id : activeHeading.id

    setHeadings(
      headings.map(heading => ({
        ...heading,
        active: heading.id === activeId,
      }))
    )
  }, [pageYOffset])

  return (
    <section className={`${styles.tocWrapper} m-card`}>
      <h1 className="m-card__title">
        <FontAwesomeIcon icon={faList} />
        <span>見出し</span>
      </h1>
      <div className="m-card__content">
        <ul className={styles.toc}>
          {headings.map(h => (
            <li
              key={h.id}
              className={`toc-${h.tag} ${h.active ? styles.tocActive : ``}`}
            >
              <Link to={`#${h.id}`}>{h.value}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Toc
