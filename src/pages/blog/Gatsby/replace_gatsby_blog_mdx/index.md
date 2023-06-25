---
title: "Gatsby製のマークダウンブログをmdxに置き換えた"
description: まだ書かれていません
category: "Gatsby"
tags:
  - ブログ
  - Gatsby
date: "2020-11-16T06:06:28Z"
thumbnail: "thumbnails/Gatsby.png"
draft: false
---

タイトルの通りなんですが、このブログのマークダウン展開を [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/) から [gatsby-plugin-mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/) に置き換えたので、簡単に流れを共有します

## なんで置き換えたの?

まず、Mdx を使うことで記事ファイル中に React のコンポーネントを埋め込めます

```md
import { TagList } from "@components/molecules/tag-list.tsx";

<TagList tags={[`Gatsby`, `ブログ`]} isLink />
```

import { TagList } from "@mdx-components/tag-list"

<TagList tags={[`Gatsby`, `ブログ`]} isLink />

こんな感じです

あとは、マークダウン関連のカスタマイズをプラグインから剥がしたかったのが大きいです

例えば、

- 見出しに id を付与したいなーとか、
- 見出し一覧作りたいなーとか
- コードブロックにタイトルつけたいなーとか

ってときに、`gatsby-transformer-remark` だと、プラグインを指して簡単に実装はできるんですけど、自分で納得の行くようにいじるみたいなのが面倒でした

`gatsby-plugin-mdx` を使うと、この辺の自由度があがるので納得のいくように調整ができそうだなーと思いました

## 手順

公式で、`mdx` に置き換えるためのガイドが公開されているので基本的にはこれに従います

[How to convert an existing Gatsby blog to use MDX | Gatsby](https://www.gatsbyjs.com/blog/2019-11-21-how-to-convert-an-existing-gatsby-blog-to-use-mdx/)

公式のガイド通り `gatsby-transformer-remark` と `gatsby-plugin-feed` を置き換えます

```bash
$ yarn add gatsby-plugin-mdx gatsby-plugin-feed-mdx @mdx-js/mdx @mdx-js/react
$ yarn remove gatsby-transformer-remark gatsby-plugin-feed
```

```diff:gatsby-config.js
{
-  resolve: `gatsby-transformer-remark`,
+  resolve: `gatsby-plugin-mdx`,
   options: {
+    extensions: [`.mdx`, `.md`],
-    plugins: [
+    gatsbyRemarkPlugins: [
       {
         resolve: `gatsby-remark-images`,
         options: {
           maxWidth: 590,
         },
       },
       {
         resolve: `gatsby-remark-responsive-iframe`,
         options: {
           wrapperStyle: `margin-bottom: 1.0725rem`,
         },
       },
       `gatsby-remark-prismjs`,
       `gatsby-remark-copy-linked-files`,
       `gatsby-remark-smartypants`,
     ],
   },
  },
- `gatsby-plugin-feed`,
+ `gatsby-plugin-feed-mdx`
```

プラグインをそのまま `gatsbyRemarkPlugins` に指してあげます

あとは、GraphQL のクエリでの記事データ取得を

- `allMarkdownRemark` => `allMdx`
- `markdownRemark` => `mdx`
- `html` => `body`
- (使っていれば) `htmlAst` => `mdxAST`

に置き換えてあげます

以下は僕の投稿用テンプレートの例です

```diff:blog-post.tsx
// ...
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
-   markdownRemark(fields: { slug: { eq: $slug } }) {
+   mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
-     html
+     body
-     htmlAst
+     mdxAST
      fields {
        slug
      }
      frontmatter {
        title
        date
        description
        category
        tags
        draft
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 590) {
              aspectRatio
              base64
              sizes
              src
              srcSet
              srcWebp
              srcSetWebp
              tracedSVG
            }
          }
        }
      }
    }
  }
`
```

あとは、記事データの展開部分を `MDXRenderer` に置き換えてあげれば完了です

```diff:tsx
import { MDXRenderer } from "gatsby-plugin-mdx"

- <div dangerouslySetInnerHTML={{ __html: post.html }} />
+ <MDXRenderer>{post.body}</MDXRenderer>
```

`htmlAst` と `mdxAST` は形式が異なっていたので、使っていた場合は対応が必要になります

## 任意のタグを上書きする

以下のように、ファイルを設置します

```ts:gatsby-browser.ts
import { wrapRootElement as wrap } from "path/to/mdx-root"

export const wrapRootElement = wrap
```

```tsx:mdx-root.tsx
import React, { ReactNode } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"

const components: MDXProviderComponents = {
  // 置き換えに使うコンポーネントをここに書く
}

export const wrapRootElement = ({
  element,
}: {
  element: ReactNode
}): ReactNode => <MDXProvider components={components}>{element}</MDXProvider>
```

これで、`components` に タグ => 置き換え先コンポーネントって感じで任意のタグをカスタマイズできます

例えば、見出し 2 の要素に id (ページ内リンク) を付与したい場合は、

```tsx:mdx-root.tsx
// ...
const toValidSlug = (baseString: string): string => {
  return baseString.replace(new RegExp(` `, `g`), `_`).toLowerCase()
}

interface H2Props {
  children: string
}

const H2: React.FC<H2Props> = ({ children }: H2Props) => {
  return <h2 id={toValidSlug(children)}>{children}</h2>
}

const components: MDXProviderComponents = {
  // 置き換えに使うコンポーネントをここに書く
  h2: H2
}
// ...
```

こんな感じで書くことが出来ます

これで、柔軟に要素をカスタマイズできるようになりました！

## コードハイライト

Mdx への置き換えに伴って、[gatsby-remark-prismjs](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/) の使用をやめました

代わりに [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) を使ってます

元々、`gatsby-remark-prismjs` には不満が結構大きくて、[Gatsby で技術ブログを作る際の知見 # コードブロックのカスタマイズ | きむそん.dev](blog/gatsby/gatsby-blog/#%E3%82%B3%E3%83%BC%E3%83%89%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA)
にも書いたんですけど、プラグインを指しつつ、スタイルを無理やり上書きしてカスタマイズするみたいな感じでした

あとデフォルトでコードブロックが親要素を飛び出してしまう問題があったりとか、結構面倒だった記憶があります

おかげでコードは汚いし、ちょっとしたことで問題が起きてました

今回置き換えをしようと思ったのも、コピーボタンに不具合が出たためでした

### Approach

`mdx` でコードブロックを書くと `pre` タグの中に展開されるので、ここを `prism-react-renderer` でハイライトしてあげます

```tsx:mdx-root.tsx
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import Pre from "path/to/pre"

const components: MDXProviderComponents = {
  // 置き換えに使うコンポーネントをここに書く
  pre: Pre
}
// ...
```

置き換えに使う `Pre` コンポーネントを準備します

### Pre コンポーネント

`props` から、コードブロックのメタ情報(コード情報、言語等)を取り出すためにパッケージを追加します

```bash
$ yarn add mdx-utils
```

#### mdx-utils の 型宣言の準備(TypeScript を使ってる場合)

[mdx-utils](https://github.com/frontarm/mdx-util) には型ファイルがないみたいなので、最低限のものだけ準備しました

```ts:vendor.d.ts
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
```

---

`mdx-utils.preToCodeBlock` を使うことで、メタ情報を抜き出して、`prism-react-render` を使ってハイライトします

```bash
$ yarn add prism-react-renderer
```

ハイライト部分はほぼ [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) のサンプルそのままです

```tsx:pre.tsx
import React from "react"
import Highlight, { defaultProps, Language } from "prism-react-renderer"
import dracula from "prism-react-renderer/themes/dracula"
import { preToCodeBlock, ChildrenPropsBase, PreProps } from "mdx-utils"

interface CodeProps {
  codeString: string
  language: Language
}

const Code: React.FC<CodeProps> = ({
  codeString,
  language,
}: CodeProps) => {
  // シンタクスハイライト用のコンポーネント
  return (
    <div>
      <Highlight
        {...defaultProps}
        code={codeString}
        language={language}
        theme={dracula}
      >
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }): React.ReactNode => (
          <pre
            className={className}
            style={style}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })} key={i}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

type ChildrenProps = ChildrenPropsBase & {
  className: string
}

const PreComponent: React.FC<PreProps<ChildrenProps>> = (
  preProps: PreProps<ChildrenProps>
) => {
  const props = preToCodeBlock<ChildrenProps>(preProps)
  if (props) {
    return <Code {...props} />
  } else {
    return <pre {...preProps} />
  }
}

export default PreComponent
```

途中で使っている `preToCodeBlock` の戻り値が

- `codeString`: コードブロックに書かれたコード
- `language`: コードブロックに付与した言語情報
- `className`

になっているので、これらをそのまま `prism-react-renderer.Highlight` に渡してあげてる感じです

`language` には、コードブロックに書いた言語部分がそのまま入るので、

- `js:hello.js` と書いてタイトルを抜き出すとか
- `codeString` からクリップボードへのコピーボタンを置くとか

結構自由にカスタマイズできます

## 終わりに

細々としたところで詰まって結構大変だった一応置き換えることができました

コードブロックの見た目が好みになってコピーボタンが治ったくらいしか変わってはないんですけど、だいぶコードがキレイになったんで満足してます

パフォーマンスだけちょっと気になるので、しばらく様子を見てみようと思います

## 参考

- [How to convert an existing Gatsby blog to use MDX | Gatsby](https://www.gatsbyjs.com/blog/2019-11-21-how-to-convert-an-existing-gatsby-blog-to-use-mdx/)
- [hagnerd/gatsby-starter-blog-mdx: Live Demo](https://github.com/hagnerd/gatsby-starter-blog-mdx)
- [Gatsby: Copy code button with confetti effect for MDX blog - Jim Raptis](https://raptis.wtf/blog/gatsby-mdx-copy-code-button-with-confetti/)
