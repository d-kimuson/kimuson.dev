import React from "react"

// @ts-ignore
import styles from "./footer.module.scss"

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
  return (
    <footer
      className={`${styles.footer} ${
        typeof className === `string` ? className : ``
      }`}
    >
      © {new Date().getFullYear()}
    </footer>
  )
}

export default Footer
