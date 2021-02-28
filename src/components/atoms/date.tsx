import React from "react"
import type { Dayjs } from "dayjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"

import { formatDate } from "@presenters/time"
// @ts-ignore
import styles from "./date.module.scss"

interface DateProps {
  date: Dayjs
}

export const Date: React.FC<DateProps> = ({ date }: DateProps) => (
  <div className={styles.date}>
    <FontAwesomeIcon icon={faCalendar} />
    <time itemProp="datePublished" dateTime={formatDate(date, `YYYY-MM-DD`)}>
      {formatDate(date)}
    </time>
  </div>
)
