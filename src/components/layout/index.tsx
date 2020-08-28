import React from "react"

import Header from "./header"
import Footer from "./footer"

interface LayoutProps {
  // 参考: https://github.com/Microsoft/TypeScript/issues/6471
  children?: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
