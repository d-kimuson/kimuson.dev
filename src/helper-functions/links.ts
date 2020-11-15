export const getBlogPostLink = (articleSlug: string): string =>
  `${articleSlug}`.toLowerCase()

export const getWorkPostLink = getBlogPostLink

export const getCategoryLink = (category: string): string =>
  `/category/${category}/`.toLowerCase()

export const getTagLink = (tag: string): string => `/tags/${tag}/`.toLowerCase()

export const toValidSlug = (baseString: string): string => {
  return baseString.replace(new RegExp(` `, `g`), `_`).toLowerCase()
}
