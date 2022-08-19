import { preToCodeBlock } from "mdx-utils"
import React, { memo } from "react"
import type { ChildrenPropsBase, PreProps } from "mdx-utils"
import type { Language } from "prism-react-renderer"
import { Code } from "./code"

const separateTitle = (
  maybeLanguage: string
): { language: Language; title: string | undefined } => {
  // `language:title` => language, title に分割する関数
  const [language, title = undefined] = maybeLanguage.split(`:`)

  if (
    ((_: string | undefined): _ is Language => typeof _ === `string`)(language)
  ) {
    return {
      language,
      title,
    }
  } else {
    return {
      language: `markup`,
      title,
    }
  }
}

const parseTitle = (title: string): string => {
  // コードタイトルの title=タイトル 記法のサポート
  const maybeTitle = title.split(`=`)[0]
  return maybeTitle ?? title
}

type ChildrenProps = ChildrenPropsBase & {
  className: string
}

const Component: React.VFC<PreProps<ChildrenProps>> = (
  preProps: PreProps<ChildrenProps>
) => {
  const props = preToCodeBlock<ChildrenProps>(preProps)
  const typedProps = props as typeof props | undefined
  if (typedProps) {
    // eslint-disable-next-line react/prop-types
    const { language, title } = separateTitle(typedProps.language)
    const propsUpdated = {
      ...typedProps,
      language: language,
      title: title ? parseTitle(title) : title,
    }
    return <Code {...propsUpdated} />
  } else {
    return <pre {...preProps} />
  }
}

export const Pre = memo(Component)
