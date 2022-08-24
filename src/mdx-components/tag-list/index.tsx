import loadable from "loadable-components"

export const TagList = loadable(async () => {
  const { TagList } = await import(`../../features/blog/components/tag-list`)
  return TagList
})
