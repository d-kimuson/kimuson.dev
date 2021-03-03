import React, { memo } from "react"
import type { Dayjs } from "dayjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"

import styles from "./date.module.scss"
import { formatDate } from "~/service/presenters/time"

interface DateProps {
  date: Dayjs
}

const Component: React.VFC<DateProps> = ({ date }: DateProps) => (
  <div className={styles.date}>
    <FontAwesomeIcon icon={faCalendar} />
    <time itemProp="datePublished" dateTime={formatDate(date, `YYYY-MM-DD`)}>
      {formatDate(date)}
    </time>
  </div>
)

export const Date = memo(Component)
