import React from "react"
import { RecoilRoot } from "recoil"
import { MdxProvider } from "../../../functional/mdx"
import { WindowResize } from "./window-resize"

type WrapRootElementProps = {
  element: React.ReactNode
}

export const WrapRootElement: React.FC<WrapRootElementProps> = ({
  element,
}) => {
  return (
    <RecoilRoot>
      <MdxProvider>
        <WindowResize>{element}</WindowResize>
      </MdxProvider>
    </RecoilRoot>
  )
}
