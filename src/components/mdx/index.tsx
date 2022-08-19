import { MDXProvider } from "@mdx-js/react"
import React from "react"
import type { MDXProviderComponents } from "@mdx-js/react"
import type { ReactNode } from "react"
import { Pre } from "./components/pre"

const components: MDXProviderComponents = {
  pre: Pre,
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
