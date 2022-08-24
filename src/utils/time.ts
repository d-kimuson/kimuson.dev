import type { Dayjs } from "dayjs"

export const formatDate = (date: Dayjs, format = `YYYY年MM月DD日`): string =>
  date.format(format)
