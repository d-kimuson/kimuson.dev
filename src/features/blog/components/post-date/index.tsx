import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import type { Dayjs } from "dayjs"
import { formatDate } from "~/utils/time"
import * as styles from "./post-date.module.scss"

type DateProps = {
  date: Dayjs
}

export const PostDate: React.FC<DateProps> = ({ date }: DateProps) => (
  <div className={styles.date}>
    <FontAwesomeIcon icon={faCalendar} />
    <time itemProp="datePublished" dateTime={formatDate(date, `YYYY-MM-DD`)}>
      {formatDate(date)}
    </time>
  </div>
)
