---
title: "ブログを GatsbyV3 へ移行した"
description: "ブログを GatsbyV3 へ移行しました"
category: "Gatsby"
tags:
  - ブログ
  - Gatsby
date: "2021-03-06T11:34:55Z"
thumbnail: "thumbnails/Gatsby.png"
draft: false
---

このブログを先日リリースされた Gatsby V3 に移行しました！

[Gatsby v3 Incremental Builds in OSS, new Gatsby Image, and more \| Gatsby](https://www.gatsbyjs.com/blog/gatsby-v3/)

大きく挙げられているのは

- 開発サーバーの高速化
- ビルド高速化
- `gatsby-plugin-image` へのリプレイスによる Lighthouse スコアの向上

の 3 つでした

## 移行する

[Migrating from v2 to v3 \| Gatsby](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/)

こちらの公式のガイドに従う形で v3 へ対応しました

後述する `gatsby-plugin-image` と CSS Modules 以外は特にコードを書き換える必要はなく、パッケージのバージョンをあげるだけで済みました

### gatsby-plugin-image への移行

`gatsby-plugin-image` への移行にもガイドが用意されていたので、これに従います(ありがたや...)

[Migrating from gatsby-image to gatsby-plugin-image \| Gatsby](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/)

```bash
$ yarn add -D gatsby-plugin-image
```

```ts:gatsby-config.js
module.exports = {
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
```

しつつ、既存の `gatsby-image` コンポーネントを置き換えていきます

gatsby-plugin-image では、`StaticImage` と `GatsbyImage` の 2 種類のコンポーネントが用意されていて、動的にクエリから取得する必要がある画像(投稿と紐付いたサムネイルとか)はこれまで通り、特定の画像ファイル(サイトロゴとか)はクエリを介さずに直接 `StaticImage` で使用できます

```tsx:StaticImage
import { StaticImage } from "gatsby-plugin-image"

<StaticImage
  src="./logo.png"
  alt="alt here"
  layout="fixed"
  height={90}
  width={120}
/>
```

`fluid` を使っていたところは、`layout="fullWidth"` 使えば良さそうです

画像周りのクエリの API も[変更](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/#api-changes)されています

```graphql:query
childImageSharp {
  gatsbyImageData(
    layout: FULL_WIDTH
    formats: [AUTO, WEBP, AVIF]
    placeholder: TRACED_SVG
  )
}
```

```tsx:GatsbyImage
import { Image } from "~/components/common/image"

const image = data.hoge.childImageSharp.gatsbyImageData

<GatsbyImage
  image={image}
  alt="alt here"
/>
```

以前よりわかりやすいですね

### CSS Modules の移行

[Migrating from v2 to v3 # CSS Modules are imported as ES Modules \| Gatsby](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3#css-modules-are-imported-as-es-modules)

にあるように、CSS Modules は `ES Modules` で読み込むようになったそうです(てことはもともと commonjs だった?)

> The web moves forward and so do we. ES Modules allow us to better treeshake and generate smaller files. From now on you’ll need to import cssModules as: import { box } from './mystyles.module.css'

ツリーシェーキングの為だそうで、たしかに合理的っすね

```diff
- import styles from "./example.module.css"
+ import { example } from "./example.module.css"
```

差分としてはこんな感じです

ただ少なくともこのブログでは、各ファイルのセレクタが多くないので抜けはほぼないからツリーシェーキング云々はそこまで影響ないだろうかなってのと、型定義が楽なので `import * as styles from "./example.module.css"` で読むようにしました

型定義は、デフォルトエクスポートがネームドエクスポートに変わったので

```diff
declare module "*.module.css" {
  const styles: {
    [key: string]: string
  }
+  export = styles
-  export default styles
}
```

こんな感じで型定義を変更しました

### SCSS の Css Modules が使えない

SCSS だと CSS Modules が読み込めなくなっていて、`gatsby-plugin-sass` が追従できてないのかなーと思ったんですけど、[公式の example](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-css-modules) に v3 対応版があがっていたので大丈夫そう

`gatsby-plugin-sass` の実装を読んでみたら、分岐で CSS Modules が有効化されてないパターンがあるみたいでした

とりあえずの対応としては、

```diff
{
  resolve: `gatsby-plugin-sass`,
  options: {
    implementation: require(`sass`),
    sassRuleTest: /\.scss$/,
    sassRuleModulesTest: /\.module\.scss$/,
+    cssLoaderOptions: {
+      modules: true,
+    },
    ...
  },
},
```

`cssLoaderOptions` で明示的に有効化してやって対応しました

~~あとで、少し試してプルリクを出しておこうと思います~~

追記: `v4.0.2` で修正されてました

## パフォーマンス

さっそくデプロイしてみました ([v3](https://83706916.kimuson-dev.pages.dev/), [v2](https://9d9ac4dc.kimuson-dev.pages.dev/))

|                    指標                    |         差分          |
| :----------------------------------------: | :-------------------: |
|                  Transfer                  | 415.9 KiB → 354.2 KiB |
| デスクトップ向け Lighthouse パフォーマンス |        95 → 99        |
|   モバイル向け Lighthouse パフォーマンス   |        75 → 78        |

FCP と TTI はほぼ変わらず(というかもともと高速)ですが、LCP と TBT が結構改善してるっぽいです

せっかく Gatsby 使ってるからには速くしておきたいので結構うれしみです

開発サーバーのほうは確かに速くなってるんですけど、(少なくとも僕の環境では)ホットリロードが回らなかったりしてて体験が微妙でした
