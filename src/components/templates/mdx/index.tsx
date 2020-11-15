import React, { ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import Pre from "./components/pre"
import { H2, H3 } from "./components/heading"

const components: MDXProviderComponents = {
  pre: Pre,
  h2: H2,
  h3: H3,
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
