import React from "react"

import type { Heading } from "@entities/post"
import { Bio } from "../organisms/bio"
import { PopularCategories } from "../organisms/popular-categories"
import { Toc } from "../organisms/toc"

interface SidebarProps {
  bio?: boolean
  commonSidebar?: boolean
  toc?: {
    headings: Heading[]
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
        {typeof toc !== `undefined` ? <Toc headings={toc?.headings} /> : null}
        {commonSidebar ? <PopularCategories /> : null}
      </div>
    </div>
  )
}
