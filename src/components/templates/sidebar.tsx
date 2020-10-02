import React from "react"

import Bio from "../organisms/bio"
import CommonSidebar from "../organisms/common-sidebar"
import Toc from "../organisms/toc"
import { HtmlAst } from "@declaration"

interface SidebarProps {
  bio?: boolean
  commonSidebar?: boolean
  toc?: {
    htmlAst: HtmlAst
  }
}

const Sidebar: React.FC<SidebarProps> = ({
  bio = false,
  commonSidebar = false,
  toc = undefined,
}: SidebarProps) => {
  return (
    <div className="l-sidebar-container">
      {bio ? <Bio /> : null}
      <div className="l-sidebar-sticky-area">
        {typeof toc !== `undefined` ? <Toc htmlAst={toc?.htmlAst} /> : null}
        {commonSidebar ? <CommonSidebar /> : null}
      </div>
    </div>
  )
}

export default Sidebar
