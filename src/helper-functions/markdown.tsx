// マークダウン展開を mdx に置き換えたので、もう使わない
import React, {
  createElement,
  DetailedReactHTMLElement,
  InputHTMLAttributes,
} from "react"
import rehypeReact from "rehype-react"

import { HtmlAst } from "@declaration"

const RehypeH2: React.FC<React.HTMLAttributes<{}>> = ({
  id,
  children,
}: React.HTMLAttributes<{}>) => {
  return <h2 id={id}>{children}</h2>
}

const options = {
  createElement: createElement,
  components: {
    h2: RehypeH2,
  },
}

type ReturnCreateElement = DetailedReactHTMLElement<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

// @ts-ignore よくわからんけど型が合わん
const processor = new rehypeReact(options)
export const renderAst: (htmlAst: HtmlAst) => ReturnCreateElement =
  processor.Compiler
