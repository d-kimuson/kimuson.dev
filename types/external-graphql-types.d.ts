// https://github.com/mdx-js/specification#mdxast に対応している type が書かれている
// 数が多くて移すのがめんどうなのと、現時点では必要性も薄いので単に string で定義する
export type MdxAstType = string
export interface MdxAstPosition {
  column: number
  line: number
  offset: number
}

export interface MdxAst {
  type: MdxAstType
  children?: MdxAst[]
  position?: {
    start: MdxAstPosition
    end: MdxAstPosition
    indent: number[]
  }
  meta?: null
  value?: string
  lang?: string
  depth?: number
  ordered?: boolean
  spread?: boolean
  start?: null
}

export interface AroundNav {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
  }
}