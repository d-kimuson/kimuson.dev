declare module "mdx-utils" {
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
    language: string
  } & Omit<ChildrenProps, "className" | "children">
}
