import classNames from "classnames"
import React from "react"
import * as styles from "./other-logo.module.scss"

type OtherLogoProps = {
  className?: string | undefined
}

const OtherLogo: React.FC<OtherLogoProps> = ({ className }) => {
  return <div className={classNames(className, styles.otherLogo)}>📝</div>
}

export default OtherLogo
