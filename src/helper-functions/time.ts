import dayjs from "dayjs"

export function formatGraphQLTime(
  timeString: string,
  format = `YYYY年MM月DD日`
): string {
  const time = dayjs(timeString).locale(`Asia/Tokyo`)
  return time.format(format)
}
