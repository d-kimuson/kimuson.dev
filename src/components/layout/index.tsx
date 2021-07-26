import React from "react"
import classnames from "classnames"

import * as styles from "./layout.module.scss"
import { Header } from "./header"
import { Footer } from "./footer"

type LayoutProps = React.PropsWithChildren<Record<string, unknown>>

const Component: React.VFC<LayoutProps> = ({ children }: LayoutProps) => {
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

export const Layout = React.memo(Component)
