import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"

import { formatGraphQLTime } from "@funcs/time"
// @ts-ignore
import styles from "./date.module.scss"

interface DateProps {
  date: string
}

const Time: React.FC<DateProps> = ({ date }: DateProps) => (
  <div className={styles.date}>
    <FontAwesomeIcon icon={faCalendar} />
    <time>{formatGraphQLTime(date)}</time>
  </div>
)

export default Time
