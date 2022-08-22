import type { Slug, Category, Tag } from "~/types/post"

export const toBlogPostLink = (articleSlug: Slug): string =>
  `${articleSlug}`.toLowerCase()

export const toWorkPostLink = toBlogPostLink

export const toCategoryLink = (category: Category): string =>
  `/category/${category}/`.toLowerCase()

export const toTagLink = (tag: Tag): string => `/tags/${tag}/`.toLowerCase()
