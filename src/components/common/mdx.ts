import loadable from "loadable-components"

export const TagList = loadable(async () => {
  const { TagList } = await import(`../common/tag-list`)
  return TagList
})
