import React from "react"

import styles from "./layout.module.scss"

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()}
    </footer>
  )
}

export default Footer
