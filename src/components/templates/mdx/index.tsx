import React, { ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"

import { Pre } from "./components/pre"

const components: MDXProviderComponents = {
  pre: Pre,
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
