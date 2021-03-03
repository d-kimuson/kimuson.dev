import React, { memo } from "react"
import type { Language } from "prism-react-renderer"
import { preToCodeBlock, ChildrenPropsBase, PreProps } from "mdx-utils"

import { Code } from "./code"

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

const parseTitle = (title: string): string =>
  // コードタイトルの title=タイトル 記法のサポート
  title.includes(`=`) ? title.split(`=`)[1] : title

type ChildrenProps = ChildrenPropsBase & {
  className: string
}

const Component: React.VFC<PreProps<ChildrenProps>> = (
  preProps: PreProps<ChildrenProps>
) => {
  const props = preToCodeBlock<ChildrenProps>(preProps)
  if (props) {
    const { language, title } = separateTitle(props.language)
    const propsUpdated = {
      ...props,
      language: language,
      title: title ? parseTitle(title) : title,
    }
    return <Code {...propsUpdated} />
  } else {
    return <pre {...preProps} />
  }
}

export const Pre = memo(Component)
