declare module "mdx-utils" {
  import type { Language } from "prism-react-renderer"

  export interface ChildrenPropsBase {
    mdxType: `code`
    children: string
  }

  export interface PreProps<ChildrenProps extends ChildrenPropsBase> {
    children: {
      props: ChildrenProps
    }
  }

  export function preToCodeBlock<ChildrenProps extends ChildrenPropsBase>(
    preProps: PreProps<ChildrenProps>
  ): {
    codeString: string
    className: string
    language: Language
  } & Omit<ChildrenProps, "className" | "children">
}
