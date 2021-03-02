import React from "react"

import type { Heading } from "~/service/entities/post"
import { Bio } from "./bio"
import { PopularCategories } from "./popular-categories"
import { Toc } from "./toc"

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
