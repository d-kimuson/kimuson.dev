import type { Range } from "./utils.type"

export const typedRange = <From extends number, To extends number>(
  from: From,
  to: To
): Range<From, To> => {
  return Array.from({ length: to }, (_v, k) => k).filter(
    (i) => i >= from
  ) as Range<From, To>
}
