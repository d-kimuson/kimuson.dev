import { useEffect, useState } from "preact/hooks"

export const useWindowWidth = (): number | undefined => {
  const [width, setWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth)
    }

    onResize()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [width])

  return width
}
