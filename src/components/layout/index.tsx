import classnames from "classnames"
import React from "react"
import { Footer } from "./footer"
import { Header } from "./header"
import * as styles from "./layout.module.scss"

type LayoutProps = React.PropsWithChildren<Record<string, unknown>>

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div
      id="layout-root"
      className={classnames(styles.layoutContainer, "m-context")}
    >
      <Header className={classnames(styles.headerWrapper, "m-z1")} />
      <div className={classnames(styles.contentWrapper, "m-context")}>
        {children}
      </div>
      <Footer className={classnames(styles.footerWrapper, "m-context")} />
      {/* portal の要素は以下にレンダリングされる */}
    </div>
  )
}
