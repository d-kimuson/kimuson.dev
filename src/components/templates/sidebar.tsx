import React from "react"

import { Bio } from "../organisms/bio"
import { PopularCategories } from "../organisms/popular-categories"
import type { TableOfContents } from "../organisms/toc"
import { Toc } from "../organisms/toc"

interface SidebarProps {
  bio?: boolean
  commonSidebar?: boolean
  toc?: {
    tableOfContents: TableOfContents
  }
  ad?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  bio = false,
  commonSidebar = false,
  toc = undefined,
}: SidebarProps) => {
  return (
    <div className="l-sidebar-container">
      {bio ? <Bio /> : null}
      <div className="l-sidebar-sticky-area">
        {typeof toc !== `undefined` ? (
          <Toc tableOfContents={toc?.tableOfContents} />
        ) : null}
        {commonSidebar ? <PopularCategories /> : null}
      </div>
    </div>
  )
}
