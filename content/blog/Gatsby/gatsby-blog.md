---
title: Gatsbyで技術ブログを作りました！
description: Gatsby+TypeScriptで技術ブログを作りました。苦労した点などをまとめます。
category: Gatsby
tags:
  - Gatsby
  - React
date: "2020-08-30T22:40:32.169Z"
thumbnail: 'thumbnails/Blog.png'
draft: false
---

技術ブログを Hugo から, Gatsyby.js に乗り換えて, リニューアルしました！

## どうして乗り換えたのか

以前のブログは [こちら](https://tech-k-labs.xyz/) です.

SSGである [Hugo](https://gohugo.io/) をベースに構築していました.

Hugo は, フロントのことはよくわからないけど, テーマ選んで手順踏めば簡単に技術ブログ建てられる！みたいな手軽さがあってとても助かっていたのですが, いかんせんGoやGoのテンプレートエンジン(?)がわからないとカスタマイズができない...みたいなツラミがありました.

あとは, 記事が増えてきて検索機能が欲しいなぁとか, 最近はフロントも触るようになってきたので, 細かいところを自分でカスタマイズしたいなぁと思うようになってきたので, フロントエンドのライブラリをベースにしたSSGへの乗り換えを検討していました.

選択肢としては,

- [Vuepress](https://vuepress.vuejs.org/)
- [Gatsby.js](https://www.gatsbyjs.com/)
- [Gridsome](https://gridsome.org/)

辺りがありましたが, ちょっと Gatsby を触る機会があって, 触ってみたら一目惚れでした...

[React](https://ja.reactjs.org/) がベースなので, Reactのエコシステムを活用できますし, 自前でのカスタマイズもしやすいですし, Webp対応がしやすかったり, ビルドしたサイトは高速で, コテコテのバックエンドが必要ないようなサイトならファーストチョイスになる印象でした.

とても気に入ったので, 勢いでこのブログを作りました！

## 技術スタック

ブログ構築には,

- TypeScript
- Gatsby.js

を使っています.

記事はマークダウンファイルで管理しています.

環境は以下の通りです.

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.6
BuildVersion:   19G2021
$ node -v
v14.6.0
$ gatsby -v
Gatsby CLI version: 2.12.95
Gatsby version: 2.24.51
  Note: this is the Gatsby version for the site at: --
```

## まずはスターターで一通りの構成を作る

自前で一から書いて行くと手間なので, [GitHub - gatsbyjs/gatsby-starter-blog: Gatsby starter for creating a blog](https://github.com/gatsbyjs/gatsby-starter-blog) をベースに作りました.

このスターターには, Markdownファイルを使って技術ブログを構築する際に欲しいようなものが最初からある程度セットアップされています.

以下のコマンドでこのスターターをベースにプロジェクトを始めることができます.

``` sh
$ gatsby new my-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

## 開発環境を整える

いろいろいじるつもりなので, 開発環境周りもある程度丁寧に作っていきます.

### コンポーネントのTypescript化

スターターにTypeScript対応のプラグインが最初から組み込まれているので, まずは `*.js` で書かれたコンポーネントを `*.tsx` に置き換えます.

各コンポーネントでは, GraphQLから取得したデータに型付けをする必要があって面倒ですが, 自動生成するツールがあるのでそちらを使います.

[gatsby-plugin-graphql-codegen](https://www.gatsbyjs.com/plugins/gatsby-plugin-graphql-codegen/) を利用した記事が多く見られましたが, 導入してみると OnSave のたびに自動生成が回ってホットリロードが止められてしまってDXがとても悪かったので, 必要なタイミングで CUI から生成するようにしました.

``` typescript
$ yarn add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

コンポーネント以外に, Gatsbyのコアになる

- gatsby-config.js
- gatsby-node.js
- gatsby-browser.js

辺りも TypeScript に置き換える余地はありますが, 結構面倒ですし, こだわりすぎるのも良くないかなってことで置き換えていません.

### CSS周りの設定

Reactでのスタイリングには,

- 通常のCSS/SASSを読み込む
- [CSS Modules](https://github.com/css-modules/css-modules)
- CSS in JS
  - [Styled Components](https://github.com/styled-components/styled-components)
  - ... etc

辺りの選択肢があります.

Styled Components を始めとした `CSS in JS` は, スタイルに関することはCSSに責務をわけてるのに, JSに統合しようって考え方自体が個人的にあまり好きはなく,

CSSでJSの値が必要な場面自体あまりない気がしますし, 必要なときはインラインスタイルを使うってやり方が一番しっくりくるので, 今回は不採用としました.

また, styled-components は人気のようですが, パフォーマンス的な問題もあるようです.

**参考**

- [CSS-in-JSパフォーマンスコスト - 緩和戦略](https://www.infoq.com/jp/news/2020/01/css-cssinjs-performance-cost/)
- [Webサイト開発にCSS in JavaScriptを使うのはやめよう | POSTD](https://postd.cc/stop-using-css-in-javascript-for-web-development-fa/)

ただ, 名前空間に関しては機械的なアプローチが欲しいので, コンポーネントのスタイルに関してはCSS Modulesを使って, それ以外は通常のCSSって感じで運用してみます.

SASSの利用には, [gatsby-plugin-sass \| Gatsby](https://www.gatsbyjs.com/plugins/gatsby-plugin-sass/) を使います.

SASSは, [dart-sass](https://github.com/sass/dart-sass) を使います.

``` bash
$ yarn add -D gatsby-plugin-sass sass postcss autoprefixer postcss-flexbugs-fixes cssnano
```

``` js:title=gatsby-config.js
module.exports = {
  ...
  plugins: [
    ...
      {
        resolve: "gatsby-plugin-sass",
        options: {
          implementation: require("sass"),
          sassRuleTest: /\.scss$/,
          sassRuleModulesTest: /\.module\.scss$/,
          postCssPlugins: [
            require('autoprefixer')({
              grid: "autoplace"
            }),
            require('postcss-flexbugs-fixes')({}),
            require('cssnano')({ preset: 'default' })
          ]
      }
    ...
  ]
  ...
}
```

PostCSSに関しては, `postCssPlugins` にプラグインをさせば良いだけなので, 簡単でした！わーい

ちなみに, CSS Modules は型宣言を生成してくれないので, import文で怒られます.

[TypeScript + React JSX + CSS Modules で実現するタイプセーフなWeb開発 - Qiita](https://qiita.com/Quramy/items/a5d8967cdbd1b8575130)

等の記事のように型定義ファイルの自動生成などの手法もあるようですが, もともとTypeScript自体もBabelでトランスパイルしているだけですし, そこまで厳格にすることもないかなってことで今回はとりあえず型チェックを無視することで解決します.

``` typescript
// @ts-ignore
import styles from "./layout.module.scss"
```

eslint で extend している構成によっては `ts-ignore` が怒られてしまうので, ルールセットを上書きしてあげる必要があります.

``` javascript:title=.eslintrc.js
module.exports = {
  ...
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    ...
  },
  ...
}
```

### Linting

Linter は, オーソドックスに

- [ESLint](https://eslint.org/)
- [stylelint](https://github.com/stylelint/stylelint)
- [prettier](https://prettier.io/)

を使うことにしました.

``` js:title=gatsby-config.js
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: "gatsby-plugin-prettier-eslint",
      options: {
        watch: true,
        eslint: {
          patterns: ["src/**/*.{ts,tsx}"],
          customOptions: {
            fix: true,
            cache: true,
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-stylelint`,
      options: {
        fix: true,
        syntax: `scss`,
        files: [
          `**/*.s?(a|c)ss`,
        ]
      }
    },
    ...
  ]
  ...
}
```

VSCodeで整形するみたいな記事がとても多くHitしますが, 個人的にエディタに依存するのが嫌なので, 開発サーバーに整形してもらうようにしてます.

**※ 追記**

- 開発サーバーに整形させても, VSCodeがもう一度Saveするまで怒るのをやめてくれない(つまり, 保存を毎回2度実行する必要がある)
- 定期的に, かつ結構高い頻度で開発サーバーが止まる

辺りのDXが悪いんで, 結局 VSCode 側で整形するようにしました.

``` js:title=gatsby-config.js
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-plugin-eslint`,
      options: {
        test: /\.ts$|\.tsx$|\.js$|\.jsx$/,
      }
    },
    {
      resolve: `gatsby-plugin-stylelint`,
      options: {
        syntax: `scss`,
        files: [
          `**/*.s?(a|c)ss`,
        ]
      }
    },
    ...
  ]
  ...
}
```

vscode の共有設定も一応書いておきます.

``` json:title=.vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint"
  ]
}
```

``` json:title=.vscode/settings.json
{
  // ESLint
  "eslint.enable": true,
  "eslint.options": {
    "configFile": "./.eslintrc.js"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.codeActionsOnSave.mode": "problems",
  "eslint.alwaysShowStatus": true,
  // Stylelint
  "stylelint.enable": true,
  // Lint On Save
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true,
  },
  // Invalidate other formatters
  "css.validate": false,
  "scss.validate": false,
}
```

だいぶ快適になりました.

### 名前解決のためにエイリアスを使う

名前解決用のエイリアスは, `tsconfig.json` の `paths` を使います(Webpackに挿しても良いですが, typescript で名前解決できてないよってVSCodeが怒ってきてうざいです).

``` json:title=tsconfig.json
{
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "paths": {
      "@graphql-types": [
        "types/graphql-types.d.ts"
      ],
      "@styles/*": [
        "src/global-styles/*"
      ]
    },
    ...
}
```

当然これらは, TypeScript ファイルであることが前提であり, SCSSの名前解決で使うときには使えませんので `gatsby-node.js` から Webpack のエイリアスを噛ませてあげます.

``` js:title=gatsby-node.js
const path = require(`path`)

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@styles": path.resolve(__dirname, `src/global-styles`),
      }
    }
  })
}
```

これで, 各コンポーネントや scss ファイルからエイリアスを使って名前解決ができるようになりました.

## ブログを作り込む

### Frontmatter の定義

[gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/) では, 記事のマークダウンファイルに `Frontmatter` 情報を付加できます.

スターターには, カテゴリ&タグ&公開/非公開設定がなかったので, この辺を追加してあげました.

``` markdown
---
title: マークダウンチートシート
description: マークダウンのチートシートです。
category: Blog
tags:
  - Markdown
  - Blog
date: "2015-05-28T22:40:32.169Z"
thumbnail: 'thumbnails/blog.png'
draft: false
---

このブログでは, マークダウンで記事を書くことができます.
```

こんな感じです.

サムネイル画像をFrontmatterから取得するのには少し詰まりました.

``` graphql
allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
  edges {
    node {
      ...
      frontmatter {
        ...
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
}
```

gataby-image を使うために, こんな感じで GraphQL から画像を取りたいんですが, `String` だと型推論されているようなので, `thumbnail` キーが画像のパスであると教えて上げる必要があります.

[GitHub - d4rekanguok/gatsby-so-57152625: Answer to a SO question](https://github.com/d4rekanguok/gatsby-so-57152625) に Frontmatter にパスを渡すサンプルが載ってたのでこちらを参考に対応しました.

### コードブロックのカスタマイズ

コードブロックのハイライトには, [Prism.js](https://prismjs.com/) が使われています.

あまりこだわりがないならそのまま使えますが,

- ファイル名の付与
- コピーボタンの追加
- Line Number の表示

辺りはしておきたかったので, 少しいじりました.

``` js:title=gatsby-config.js
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      "gatsby-remark-code-titles",
      {
        resolve: "gatsby-remark-code-buttons",
        options: {
          toasterText: 'Copied'
        }
      },
      {
        resolve: "gatsby-remark-prismjs",
        options: {
          classPrefix: "language-",
          inlineCodeMarker: null,
          aliases: {},
          showLineNumbers: true,
          noInlineHighlight: true,
          prompt: {
            user: "root",
            host: "localhost",
            global: false,
          },
        }
      },
      {
        resolve: `gatsby-remark-images`,
        options: {
          maxWidth: 590
        },
      },
      `gatsby-remark-copy-linked-files`,
      `gatsby-remark-smartypants`,
    ],
  },
}
```

いろいろと痒いところに手が届いていなかったので, CSSを書いて上書きしてあげました.

``` scss:title=src/global-styles/styles/_markdown.scss
@use "sass:color";
@use "../global/" as g;
@import "~prismjs/themes/prism-okaidia";
@import "~prismjs/plugins/line-numbers/prism-line-numbers.css";

// prismjs
// [WARN] ピクセル数は, prismjs.css からもらってきてるものもあるので変更には注意
$-code-block-y-margin: 20px;
// Code Title
.gatsby-code-title {
  margin: $-code-block-y-margin 0 0 20px;
  display: inline-block;
  text-align: center;
  padding: 2px 15px;
  border-radius: 5px 5px 0 0;
  background: g.$theme-color;
  color: g.$theme-text-color;
}
// Copy Button
.gatsby-code-button-container {
  position: relative;
  top: 0;
}
.gatsby-code-button {
  position: absolute;
  top: 17px;
  right: 15px;
  z-index: 100;
  &::after {
    display: none !important;
  }

  svg {
    filter: invert(98%) sepia(5%) saturate(983%) hue-rotate(178deg)
      brightness(95%) contrast(99%);
    opacity: 0.9;
  }
}
:not([class="gatsby-code-title"]) + .gatsby-code-button-container {
  // code title なしの場合に, titleの代わりに上マージンを設置
  margin-block-start: $-code-block-y-margin;
}

// Codeblock
$-code-height: 20px;
pre[class*="language-"] {
  margin: 0 0 $-code-block-y-margin 0;
  span[class="line-numbers-rows"] {
    padding: 16px 0; // [変更不可] code block と統一
    span::before {
      display: flex;
      justify-content: center;
      padding-left: 0.8em; // [変更不可] padding-rightと統一
    }
  }

  .line-numbers-rows > span::before,
  .token {
    font-family: g.$code-fonts, monospace !important;
    font-size: 1.2rem;
  }
}

$-copy-toaster-height: 100px;
.gatsby-code-button-toaster {
  position: fixed;
  top: calc(50vh - #{$-copy-toaster-height} / 2);
  left: 0;
  z-index: 999;
  height: $-copy-toaster-height;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparentize($color: g.$black, $amount: 0.2);

  .gatsby-code-button-toaster-text {
    color: g.$white;
  }
}

.gatsby-code-title,
.gatsby-code-button-toaster-text {
  font-family: g.$code-fonts, monospace !important;
}
```

更に上書きすることはないと思うので, 気にせず `important` とか使って無理やり上書きしてしまいましたが, とりあえず求める形にはなりました.

### 記事検索

今の Hugo ベースのブログでは, 記事数が100件近くなってきていて, ｢これ前詰まって記事書いた気がする！どこだっけ?｣ みたいなときに, 探すのに苦労することが多々ありました(T_T)

ですので, 今回は最初から記事検索をできるようにしておきたいと思います.

Gatsbyで記事検索となると, 検索機能が SaaS として提供される [Algolia](https://www.algolia.com/) を利用した例が多いようでしたが,

- 従量課金制であること(収益化目的でないブログなので, 回収できないお金をかけたくない)
- 本文ではなく, 記事タイトルから部分検索ができれば必要十分なので, オーバースペック
- できるだけ, クライアントサイドで完結させたい

等の理由から, 採用しませんでした.

Gatsbyでは, GraphQLスキーマを用いることで任意のコンポーネントから任意のコンテンツにアクセスできますので, 検索自体は比較的簡単に実装できます.

``` tsx:title=src/components/layout/search.tsx
import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Fuse from "fuse.js"

import { SearchQuery, MarkdownRemarkEdge } from "@graphql-types"

interface Page {
  title: string
  slug: string
}

const query = graphql`
  query Search {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            draft
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

const Search: React.FC = () => {
  const data: SearchQuery = useStaticQuery(query)
  const targets = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
    .filter(e => !e.node.frontmatter?.draft)
    .map(e => ({
      title: e.node.frontmatter?.title,
      slug: e.node.fields?.slug,
    }))
    .filter((p): p is Page => typeof (p.title && p.slug) !== `undefined`)

  const fuse = new Fuse(targets, {
    keys: [`title`],
  })

  const [results, setResults] = useState<Page[]>([])

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    setResults(
      fuse
        .search(event.currentTarget.value)
        .map(_ => _.item)
        .slice(0, 10)
    )
  }

  return (
    <div className={styles.headerSearch}>
      <input
        type="text"
        onKeyUp={handleKeyUp}
        placeholder="記事を検索する"
      />
      <ul>
        {results.map(result => (
          <li key={result.slug}>
            <Link to={result.slug}>
              {result.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Search
```

こんな感じです.

部分検索には, 実装が容易そうだったので, [Fuse.js](https://fusejs.io/) を使いました.

記事が増えてきて, パフォーマンス的な問題や仕様の不満が出てきたらまた考えます.

### 目次をつける

[Qiita](https://qiita.com/) の目次UIがいつもわかりやすくていいなぁと思っていたので, ほぼ同じ感じで実装しました.

目次は, スターターの時点から `markdownReamrk.tableOfContents` に入っていたのでこれを直接貼れば良さそうだったのですが, [gatsby-link](https://www.gatsbyjs.com/docs/gatsby-link/) で設置したかったので, 自前で実装しました.

``` tsx:title=src/content/sidebar/toc.tsx
import React from "react"
import { Link } from "gatsby"

interface HtmlAst {
    type: string;
    value?: string;
    tagName?: string;
    properties?: {
        id?: string;
        class?: string;
    };
    children?: HtmlAst[];
}

interface Heading {
  tag: string
  id: string
  value: string
}

interface TocProps {
  htmlAst: HtmlAst
}

const Toc: React.FC<TocProps> = ({ htmlAst }: TocProps) => {
  const headings = htmlAst.children
    .filter(node => node.type === `element` && [`h2`, `h3`].includes(node.tagName || ``))
    .map(node => ({
      tag: node.tagName,
      id: node.properties?.id,
      value: node.children.find(item => item.type == `text`)?.value,
    }))
    .filter(
      (h): h is Heading => typeof (h.tag && h.id && h.value) !== `undefined`
    )

  return (
    <section>
      <h1>この記事の見出し</h1>
      <ul>
        {headings.map(h => (
          <li key={h.id} className={`toc-${h.tag}`}>
            <Link to={`#${h.id}`}>{h.value}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Toc
```

こんな感じです.

デフォルトだと, Heading に id 付与がされてないので, `gatsby-transformer-remark` のプラグインに [gatsby-remark-autolink-headers](https://www.gatsbyjs.com/plugins/gatsby-remark-autolink-headers/) を追加しておくか,

記事のHTML展開を `rehypeReact` に任せて自前で付与(参考: [GatsbyJS rehypeReactでマークダウンの内容を変更する](https://ichinari.work/JavaScript_GatsbyJS_Markdown_20190711))してあげる必要があります.

### その他に追加しているプラグイン

紹介した以外に以下のプラグインを使っています.

| plugin | 用途 |
| :--- | :--- |
| gatsby-plugin-remove-console | 本番環境での `console.log` の除去 |
| gatsby-plugin-google-analytics | Google Analytics によるアクセス解析 |
| gatsby-plugin-next-seo | より詳細なSEO設定(ページ毎の title, description, etc ) |
| gatsby-plugin-sitemap | sitemap.xml の自動生成 |
| gatsby-plugin-robots-txt | robots.txt の自動生成 |

## Netlify にデプロイする

このブログは [Netlify](https://www.netlify.com/) にデプロイしています.

SSGなので, DBやアプリケーションサーバーを用意する必要がなく, 結果的にコスト面がかなり抑えられるのでありがたいです.

実際このブログも独自ドメイン代しかかかってないです.

### ビルドでもキャッシュを使う

ビルドは, ローカルで走らせても問題ありませんが, Netlify ならリモートの更新と同時に使い捨てのコンテナで走らせるのが一般的だと思います.

Gatsbyでは, ビルド時間が長くなりがちで `.cache` ディレクトリにキャッシュを置いて改善していますが, クラウドでビルドすると, 当然毎回コンテナを立ち上げているのでキャッシュが利用できません.

つまり毎回のビルドにめちゃくちゃ時間がかかります.

[Netlify の GatsbyCache プラグイン](https://github.com/jlengstorf/netlify-plugin-gatsby-cache) を使うことで, キャッシュが効かせられるようになるので, 追加しておきます.

### 独自ドメインとDNS設定

ドメインは, [Google Domains](https://domains.google/intl/ja_jp/) から取得しました.

以前はお名前ドットコムを使っていたのですが, 管理サイトの使いにくさと大量のメール通知にうんざりしていたので乗り換えました(めっちゃ快適です😭 😭 😭 ).

名前解決には, Google Domains の DNS を使う方法と, Netlify DNS を使う方法があります.

素直にAレコード置いている例をよく見ますが, Netlify DNS は自動的に CDN が使えるらしいです.

> Netlify offers the option to handle DNS management for you. This enables advanced subdomain automation and deployment features, and ensures that your site uses our CDN for the apex domain as well as subdomains like www.

あえて使わない理由もないので, ありがたく恩恵に授かることにしました.

あるいは, 個人規模のものなら無料プランでCDNを設置できる
[Cloudflare CDN |コンテンツ配信ネットワーク | Cloudflare ](https://www.cloudflare.com/ja-jp/cdn/)
等の選択肢もあると思います.

SSL化については, Netlify側で自動で設定してくれるので, 特に気にすることはありません.

## 終わりに

とりあえず機能面は満足の行く形になりましたが, デザイン面はほぼ気にせずに作ってしまったので, だいぶダサイ(というかちゃっちい?)感じになってしまいました.

少しずつ直していこうと思います.

## 参考にさせて頂きました

- [Gatsby + TypeScript で技術ブログを書くための知見](https://blog.ojisan.io/1st-blog-stack)