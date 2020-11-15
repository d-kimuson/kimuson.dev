import React, { FC, ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import type { Language } from "prism-react-renderer"
import { preToCodeBlock, ChildrenPropsBase, PreProps } from "mdx-utils"

import { Code } from "@components/atoms/code"

const separateTitle = (
  maybeLanguage: string
): { language: Language; title?: string } => {
  // `language:title` => language, title に分割する関数

  const [language, title = undefined] = maybeLanguage.split(`:`)

  if (((_: string): _ is Language => typeof _ === `string`)(language)) {
    return {
      language,
      title,
    }
  } else {
    return {
      language: `markup`,
      title: title,
    }
  }
}

type ChildrenProps = ChildrenPropsBase & {
  className: string
}

const PreComponent: FC<PreProps<ChildrenProps>> = (
  preProps: PreProps<ChildrenProps>
) => {
  const props = preToCodeBlock<ChildrenProps>(preProps)
  const { language, title } = separateTitle(props.language)
  const propsUpdated = {
    ...props,
    language: language,
    title: title,
  }
  if (props) {
    return <Code {...propsUpdated} />
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
