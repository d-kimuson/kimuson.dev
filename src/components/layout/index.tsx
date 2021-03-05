import React, { memo, useMemo } from "react"

import * as styles from "./layout.module.scss"
import { Header } from "./header"
import { Footer } from "./footer"

interface LayoutProps {
  children?: React.ReactNode
}

const Component: React.VFC<LayoutProps> = ({ children }: LayoutProps) => {
  const cachedStyles = useMemo(() => styles, [children])

  return (
    <div className={styles.layoutContainer}>
      <Header className={cachedStyles.headerWrapper} />

      <div className={styles.contentWrapper}>{children}</div>

      <Footer className={cachedStyles.footerWrapper} />
    </div>
  )
}

export const Layout = memo(Component)
