import React from "react"
import type { Heading } from "~/types/post"
import * as layoutStyles from "../layout.module.scss"
import { Adsense } from "./adsense"
import { PopularCategories } from "./popular-categories"
import * as styles from "./sidebar.module.scss"
import { Toc } from "./toc"

export type SidebarProps = {
  commonSidebar?: boolean | undefined
  toc?:
    | {
        headings: Heading[]
      }
    | undefined
  ad?: boolean | undefined
}

export const Sidebar: React.FC<SidebarProps> = ({
  commonSidebar = false,
  toc = undefined,
}) => {
  return (
    <section className={layoutStyles.sidebarContainer}>
      <div className={layoutStyles.sidebarStickyArea}>
        {typeof toc !== `undefined` ? <Toc headings={toc.headings} /> : null}
        {commonSidebar ? <PopularCategories /> : null}
        <div className={styles.adsenseWrapper}>
          <Adsense />
        </div>
      </div>
    </section>
  )
}
