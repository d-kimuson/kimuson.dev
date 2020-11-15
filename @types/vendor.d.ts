declare module "mdx-utils" {
  interface ChildrenPropsBase {
    mdxType: `code`
    children: string
  }

  interface PreProps<ChildrenProps extends ChildrenPropsBase> {
    children: {
      props: ChildrenProps
    }
  }

  function preToCodeBlock<ChildrenProps extends ChildrenPropsBase>(
    preProps: PreProps<ChildrenProps>
  ): {
    codeString: string
    className: string
    language: string
  } & Omit<ChildrenProps, "className" | "children">
}
