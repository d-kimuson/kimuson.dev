import loadable from "loadable-components"

export const TagList = loadable(async () => {
  const { TagList } = await import(`./molecules/tag-list`)
  return TagList
})
