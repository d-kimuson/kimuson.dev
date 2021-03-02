import { Heading } from "~/service/entities/post"

interface TableOfContent {
  url: string
  title: string
  items?: TableOfContent[]
}

export interface TableOfContents {
  items: TableOfContent[]
}

export const toHeadings = (tableOfContents: TableOfContents): Heading[] => {
  return tableOfContents.items.reduce(
    (headings: Heading[], t: TableOfContent) => {
      headings.push({
        tag: `h2`,
        id: t.url.replace(`#`, ``),
        title: t.title,
      })
      ;(t.items || []).forEach((item: TableOfContent) => {
        headings.push({
          tag: `h3`,
          id: item.url.replace(`#`, ``),
          title: item.title,
        })
      })

      return headings
    },
    []
  )
}
