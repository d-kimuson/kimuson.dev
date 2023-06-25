import { useState, useEffect } from "preact/hooks"
import type { BlogPropsSchema } from "~/features/blog/schemas/blog-props.schema"
import { headerHeight } from "~/features/layout/config"

export const useCurrentToc = (
  headings: BlogPropsSchema["headings"]
): string | undefined => {
  const [currentToc, setCurrentToc] = useState<string | undefined>(
    headings.at(0)?.slug
  )

  useEffect(() => {
    const headingTopStore: { slug: string; top: number }[] = headings
      .flatMap(({ slug }) => {
        const elementTop = document
          .getElementById(slug)
          ?.getBoundingClientRect().top

        return elementTop === undefined
          ? []
          : [
              {
                slug,
                top: elementTop,
              },
            ]
      })
      .sort((a, b) => (a.top > b.top ? 1 : 0))

    const onScroll = () => {
      const previousTocIndex = headingTopStore.findIndex(
        ({ top }) => top > window.pageYOffset + headerHeight + 1
      )
      const updatedToc = headingTopStore.at(
        previousTocIndex === 0 ? 0 : previousTocIndex - 1
      )

      if (updatedToc !== undefined) {
        setCurrentToc(updatedToc.slug)
      }
    }

    onScroll()
    document.addEventListener("scroll", onScroll)

    return () => {
      document.removeEventListener("scroll", onScroll)
    }
  }, [])

  return currentToc
}
