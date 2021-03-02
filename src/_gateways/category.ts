import { uniq } from "ramda"

import type { MdxFrontmatter } from "@graphql-types"
import type { Category, CategorySummary } from "~/_entities/post"
import { filterDraftPostList } from "~/_presenters/post"

const countCategories = (categories: Category[]): CategorySummary[] =>
  uniq(categories).map((category) => ({
    category,
    count: categories.filter((category_) => category_ === category).length,
  }))

export const toCategorySummaryList = (
  edges: {
    node?: {
      frontmatter?: Pick<MdxFrontmatter, "category" | "draft">
    }
  }[]
): CategorySummary[] => {
  const categories = filterDraftPostList(
    edges.map((edge) => ({
      name: edge.node?.frontmatter?.category,
      draft: edge.node?.frontmatter?.draft || false,
    }))
  )
    .map((category) => category.name)
    .filter((category): category is Category => typeof category === `string`)

  return countCategories(categories)
}
