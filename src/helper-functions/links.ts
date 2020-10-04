// gatsby-node.js で定義済みなので, 変更時はそちらも一緒に
export const getArticleLink = (articleSlug: string): string =>
  `/posts/${articleSlug}`

export const getCategoryLink = (category: string): string =>
  `/categories/${category}/`

export const getTagLink = (tag: string): string => `/tags/${tag}/`
