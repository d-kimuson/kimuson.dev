import React from "react"

import Header from "./header"
import Footer from "./footer"
import "../../global-styles/index.scss"
import styles from "./layout.module.scss"

interface LayoutProps {
  // 参考: https://github.com/Microsoft/TypeScript/issues/6471
  children?: any;
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <div className={styles.content}>
        <div className="l-page-container">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
