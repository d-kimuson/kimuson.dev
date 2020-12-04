import React, { ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import loadable from "loadable-components"

const components: MDXProviderComponents = {
  pre: loadable(() => import(`./components/pre`)),
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
