---
title: "Reactでグローバルなレイアウトの重ね合わせを制御するときはPortalを使うと良い"
description: React 下で z-index を制御するときの良さげな方法を紹介します
category: "フロントエンド"
tags:
  - React
  - CSS
date: "2021-07-28T07:35:43Z"
thumbnail: "thumbnails/フロントエンド.png"
draft: false
---

React で全体レイアウトの重ね合わせを制御したいときは、Portal を使うと良いよという話をします

## z-index つらい問題への一般的な対策

要素間の重ね合わせの順序付けといえば、z-index ですが、運用が長いほど秩序がなくなりがちで辛いです

サイト全体で z-index を使おうとすると、あとからもっと上にしたい要素が登場して無限にインフレしていくという問題に加えて

[君は真に理解しているか？z-index とスタッキングコンテキストの関係 - ICS MEDIA](https://ics.media/entry/200609/)

詳細は以上の記事に譲りますが、z-index はあくまでスタッキングコンテキスト下での優先順位なので、大きいほうが必ず上ということではないという問題もあります

きちんと重ね合わせを制御しようと思うと、スタッキングコンテキストを把握する必要がありますが、結構色々なところでスタッキングコンテキストが作られるのでどこで作られるかを常に把握するのはかなり辛いです

参考: [重ね合わせコンテキスト - CSS: カスケーディングスタイルシート \| MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

ですので、[z-index との安全な付き合い方 \| Basicinc Enjoy Hacking!](https://tech.basicinc.jp/articles/170) で紹介されているように

- z-index を使うときは明示的にスタッキングコンテキストを作ってスコープを作る
- `z-index: 1 or 2` 程度のみで順序を制御する (`z-index: 1` は未指定より格上)
- 遠くの要素との重ね合わせ制御はしない

という形で制御してあげるのが良いと思います

## 汎用の重ね合わせ制御用スタイル

説明のために、スタッキングコンテキストと z-index を指定するユーティリティクラスを作っておきます

```scss
.m-context {
  isolation: isolate;
}

@for $i from 1 through 5 {
  .m-z#{$i} {
    z-index: $i;
    position: relative;
  }
}
```

`isolation: isolate;` は重ね合わせコンテキストを作るプロパティです

IE に対応しなくて良いなら、意図が明確なのでこちらが良いと思います(対応しないといけないなら `transform: scaleX(1);` とか適当に )

これで、親に `m-context` を渡してやって、優先したい要素に `m-z1` を付与してやれば良いことになります

他の要素すべてに `m-context` を付与しておけばスコープができるので、他の要素下の要素から `m-z1` を付与した要素が上書きされないことも保証できます(とはいえ、 `m-context` 下でのみ `z-index` を使うルールで運用するなら冗長だと思うのでなくても良いと思います)

## 全体レイアウトでのスタッキングコンテキストと問題点

さて、本題です

一般的なユースケースでは、上記の戦略で良さそうですがグローバルのレイアウトだと少し問題があります

例えばこのブログのような固定ヘッダー+コンテンツ+フッターの場合、スタッキングコンテキストで制御しようとするなら、全体のレイアウトを担う要素にスタッキングコンテキストを作ってやることになります

```html
<div class="l-container m-context">
  <header class="l-header m-z1">
    <!-- 画面上部に固定するスタイルが当たってると思ってください -->
  </header>
  <main role="main" class="l-main"></main>
  <footer class="l-footer"></footer>
</div>
```

これで `l-header > l-main = l-footer` という優先順位になりました

ただし、ここに固定ヘッダより上に表示されるモーダルウィンドウを追加したいとなったとき、このやり方だとモーダルの優先順位を固定ヘッダより上に持ってくるには `m-context` 下でのみ `z-index` を付与するというルールを破る必要がある or すでに存在している場合は不可能となります

ここで活躍するのが React Portal です

## Portal で l-container 下に DOM を飛ばす

[React Portal](https://ja.reactjs.org/docs/portals.html) は DOM のレンダリング先を特定の HTML 要素下に移動できる機能です

つまり、なんらかのイベントでモーダルウィンドウが起動したとき、DOM の出現場所を以下のようにすることができます

```html
<div class="l-container">
  <header class="l-header"></header>
  <main role="main" class="l-main"></main>
  <footer class="l-footer"></footer>
  <div class="m-modal1">
    <p>Modal DOM</p>
  </div>
</div>
```

これならスタッキングコンテキストを貼っている `l-container` 直下なので、秩序ある状態で重ね合わせ順を制御できることになります

### Layout コンポーネント

事前に、Layout コンポーネントを用意しておきます

```tsx:Layout.tsx
type LayoutProps = React.PropsWithChildren<Record<string, unknown>>

export const Layout: React.VFC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div id="layout-root" className="l-container m-context-parent">
      <header className="l-header m-z1"></header>
      <main role="main" class="l-main">{children}</main>
      <footer className="l-footer"></footer>
      {/* portal の要素は以下にレンダリングされる */}
    </div>
  )
}
```

portal から HTML 要素を取得するため、`#layout-root` を降っておきます

### 汎用の Portal コンポーネントを作る

グローバルで重ね合わせ順序を比較する必要がある場合は、以下で定義した Portal コンポーネントでくくってやれば良いです

```tsx:portal.tsx
import { createPortal } from "react-dom"

type PortalProps = React.PropsWithChildren<Record<string, unknown>>

export const Portal: React.VFC<PortalProps> = ({ children }: PortalProps) => {
  const element = document.getElementById("layout-root")

  return element !== null ? createPortal(children, element) : null
}
```

例えば、モーダルウィンドウなら以下のイメージです

```tsx:イメージ
<button onClick={openModal}>Open Modal!</button>
<Portal>
  <div class="modal m-z2">
    <p>モーダルの中身だよ！</p>
  </div>
</Portal>
```

コンポーネントから見ると自身の直下にありますが、実際は

```html
<div class="l-container m-context">
  <header class="l-header m-z1"></header>
  <main role="main" class="l-main m-context"></main>
  <footer class="l-footer m-context"></footer>
  <div class="modal m-z2">
    <p>モーダルの中身だよ！</p>
  </div>
</div>
```

という形でレンダリングされ、スコープを汚さないまま z-index の優先順位を制御できます

## まとめ

- z-index の絶対値で重ね合わせを制御するのは辛いので、スタッキングコンテキストで制御したほうが良い
- 全体レイアウトだと、モーダルウィンドウ系がネックになるが React Portal を使うことで解決できる

Vue には明るくないのでわかりませんが、おそらく [Teleport \| Vue.js](https://v3.ja.vuejs.org/guide/teleport.html) を使うことで同様のことが可能だと思います

モーダルの問題さえ解ければスタッキングコンテキストから管理してやるのがベストだと思うので、こちらのやり方をぜひお試しください
