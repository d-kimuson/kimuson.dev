import React from "react"

import styles from "./layout.module.scss"
import { Header } from "./header"
import { Footer } from "./footer"

interface LayoutProps {
  children?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layoutContainer}>
      <Header className={styles.headerWrapper} />

      <div className={styles.contentWrapper}>{children}</div>

      <Footer className={styles.footerWrapper} />
    </div>
  )
}
