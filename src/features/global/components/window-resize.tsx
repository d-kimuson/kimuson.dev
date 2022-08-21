import { useEffect } from "react"
import React from "react"
import { useSetRecoilState } from "recoil"
import { windowSizeState } from "../store/window.store"

type WindowResizeProps = React.PropsWithChildren<Record<string, unknown>>

export const WindowResize: React.FC<WindowResizeProps> = ({ children }) => {
  const setWindowSize = useSetRecoilState(windowSizeState)
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })
  }, [])

  return <React.Fragment>{children}</React.Fragment>
}
