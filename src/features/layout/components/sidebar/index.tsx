import React from "react"
import type { Heading } from "~/types/post"
import * as layoutStyles from "../layout.module.scss"
import { Adsense } from "./adsense"
import { Bio } from "./bio"
import { PopularCategories } from "./popular-categories"
import * as styles from "./sidebar.module.scss"
import { Toc } from "./toc"

export type SidebarProps = {
  bio?: boolean | undefined
  commonSidebar?: boolean | undefined
  toc?:
    | {
        headings: Heading[]
      }
    | undefined
  ad?: boolean | undefined
}

export const Sidebar: React.FC<SidebarProps> = ({
  bio = false,
  commonSidebar = false,
  toc = undefined,
}) => {
  return (
    <section className={layoutStyles.sidebarContainer}>
      {bio ? <Bio /> : null}
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
