import React, { FC, ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import { Code } from "./src/components/atoms/code"
import { preToCodeBlock, ChildrenPropsBase, PreProps } from "mdx-utils"

type ChildrenProps = ChildrenPropsBase & {
  className: string
}

const PreComponent: FC<PreProps<ChildrenProps>> = (
  preProps: PreProps<ChildrenProps>
) => {
  const props = preToCodeBlock<ChildrenProps>(preProps)
  if (props) {
    return <Code {...props} />
  } else {
    return <pre {...preProps} />
  }
}

const components: MDXProviderComponents = {
  pre: PreComponent,
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
