import { replaceAll } from "./util"

export const getBlogPostLink = (articleSlug: string): string =>
  `${articleSlug}`.toLowerCase()

export const getWorkPostLink = getBlogPostLink

export const getCategoryLink = (category: string): string =>
  `/category/${category}/`.toLowerCase()

export const getTagLink = (tag: string): string => `/tags/${tag}/`.toLowerCase()

export const toValidSlug = (baseSlug: string): string => {
  const inValidStrings = [`?`]
  const removedSlug = inValidStrings.reduce(
    (s, t) => replaceAll(s, t, ``),
    baseSlug
  )
  return replaceAll(removedSlug, ` `, `_`).toLowerCase()
}
