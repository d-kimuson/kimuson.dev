// gatsby-node.js で定義済みなので, 変更時はそちらも一緒に
export const getArticleLink = (articleSlug: string): string =>
  `${articleSlug}`.toLowerCase()

export const getCategoryLink = (category: string): string =>
  `/category/${category}/`.toLowerCase()

export const getTagLink = (tag: string): string => `/tags/${tag}/`.toLowerCase()
