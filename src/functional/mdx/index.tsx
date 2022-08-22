import { MDXProvider as BaseMDXProvider } from "@mdx-js/react"
import React from "react"
import type { MDXProviderComponents } from "@mdx-js/react"
import { Pre } from "./components/pre"

const components: MDXProviderComponents = {
  pre: Pre,
}

type MdxProviderProps = React.PropsWithChildren<Record<string, unknown>>

export const MdxProvider: React.VFC<MdxProviderProps> = ({ children }) => {
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>
}
