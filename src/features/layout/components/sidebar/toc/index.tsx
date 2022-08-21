import { faList } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState, useEffect, memo } from "react"
import { Link } from "~/functional/mdx/link"
import type { Heading } from "~/service/entities/post"
import * as styles from "./toc.module.scss"

const infinity = 100000
const headerHeight = 60

type TocHeading = {
  active: boolean
  top: number
  elm: HTMLElement | undefined
} & Heading

const toTocHeading = (heading: Heading): TocHeading => ({
  ...heading,
  top: infinity,
  active: false,
  elm: undefined,
})

type TocProps = {
  headings: Heading[]
}

const Component: React.FC<TocProps> = ({ headings }: TocProps) => {
  const [tocHeadings, setTocHeadings] = useState<TocHeading[]>(
    headings.map(toTocHeading)
  )

  const [pageYOffset, setPageYOffset] = useState<number>(0)

  // functions
  const setHeadingTop = (
    heading: TocHeading
  ): { top: number } & TocHeading => ({
    ...heading,
    top: heading.elm?.getBoundingClientRect().top ?? infinity,
  })

  // 処理化処理
  useEffect(() => {
    const headings = tocHeadings.map((tocHeading) => {
      const elm = document.getElementById(tocHeading.id)
      return {
        ...tocHeading,
        elm: elm === null ? undefined : elm,
      }
    })
    // 対応するHTML要素をセット
    setTocHeadings(headings)

    // スクロールイベントで座標を更新するリスナー
    document.addEventListener(`scroll`, () =>
      setPageYOffset(window.pageYOffset)
    )
  }, [])

  // 画面位置の変更
  useEffect(() => {
    if (typeof tocHeadings[0]?.elm === `undefined`) return

    const activeHeading = tocHeadings
      .map(setHeadingTop)
      .filter((tocHeading) => tocHeading.top <= headerHeight + 5)
      .slice(-1)[0]

    const activeId =
      typeof activeHeading === `undefined` ? headings[0]?.id : activeHeading.id

    setTocHeadings(
      tocHeadings.map((tocHeading) => ({
        ...tocHeading,
        active: tocHeading.id === activeId,
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
          {tocHeadings.map((tocHeading) => (
            <li
              key={tocHeading.id}
              className={`toc-${tocHeading.tag} ${
                tocHeading.active ? styles.tocActive : ``
              }`}
            >
              <Link to={`#${tocHeading.id}`}>{tocHeading.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export const Toc = memo(Component)
