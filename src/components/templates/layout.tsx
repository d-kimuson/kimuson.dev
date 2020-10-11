import React from "react"

import Header from "../organisms/header"
import Footer from "../organisms/footer"
// @ts-ignore
import styles from "./layout.module.scss"

interface LayoutProps {
  // 参考: https://github.com/Microsoft/TypeScript/issues/6471
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layoutContainer}>
      <Header className={styles.headerWrapper} />

      <div className={styles.contentWrapper}>{children}</div>

      <Footer className={styles.footerWrapper} />
    </div>
  )
}

export default Layout
