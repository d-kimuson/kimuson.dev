import classnames from "classnames"
import React from "react"
import type { SidebarProps } from "../sidebar"
import { Footer } from "../footer"
import { Header } from "../header"
import * as styles from "../layout.module.scss"
import { Sidebar } from "../sidebar"

type LayoutProps = React.PropsWithChildren<
  Pick<SidebarProps, "toc"> & {
    afterMainChildren?: React.ReactNode
  }
>

export const CommonLayout: React.FC<LayoutProps> = ({
  children,
  toc,
  afterMainChildren,
}: LayoutProps) => {
  return (
    <div
      id="layout-root"
      className={classnames(styles.layoutContainer, "m-context")}
    >
      <Header className={classnames(styles.headerWrapper, "m-z1")} />
      <div className={classnames(styles.contentWrapper, "m-context")}>
        <div className={styles.pageContainer}>
          <div className={classnames(styles.mainWrapper, styles.mainWidth)}>
            <main role="main">{children}</main>
          </div>
          <Sidebar bio={true} toc={toc} commonSidebar={true} ad={true} />
        </div>
        {afterMainChildren ?? null}
      </div>
      <Footer className={classnames(styles.footerWrapper, "m-context")} />
      {/* portal の要素は以下にレンダリングされる */}
    </div>
  )
}
