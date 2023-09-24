import type { Range } from "./utils.type";

export const typedRange = <From extends number, To extends number>(
  from: From,
  to: To
): Range<From, To> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TODO: あとでちゃんと対応
  return Array.from({ length: to }, (_v, k) => k).filter(
    (i) => i >= from
  ) as Range<From, To>;
};
