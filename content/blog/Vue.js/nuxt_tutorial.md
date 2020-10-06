---
title: "Nuxt で SSR してみる"

thumbnail: "/thumbnails/prog_g.png"
tags:
  - "JavaScript"
  - "Nuxt.js"
category: "Vue.js"
date: "2020-02-13T08:31:19+09:00"
weight: 5
draft: true
---

最近のクライアントサイドの話題に触れてると, SSRの話をちょくちょく聞く.

クライアントサイドのFWで構築したアプリケーションを無理やりモノリシックな構成に近づける(メニューとかのDOM更新はそのまま, Vue Routerとかでページ分けしてた部分はDOM更新じゃなくてサーバーサイドで...)みたいなイメージだけど, 

正直良くわかってなくて, やっぱ触ってみるのが一番かなってことでnuxtでssrオプションの挙動を一通り確認してみようと思う.

## くりえいとなくすとあっぷ

とりあえずアプリつくる.

オプションで, SPAではなくSSRを選択しておく.

``` bash
$ npx create-nuxt-app nuxt-tutorial
$ cd nuxt-tutorial
$ yarn build && yarn start
```

これで, 初期アプリのビルドとプロダクション用サーバーが起動した.

## ざっと理解する

nuxtの理解は本筋ではないので, ざっと理解する

[ディレクトリ構造 - NuxtJS](https://ja.nuxtjs.org/guide/directory-structure) に各ディレクトリの用途がざっと書いてあった.

一部拾うと,

| ディレクトリ名 | 用途                        |
| :------------- | :-------------------------- |
| components     | vue コンポーネントを置く    |
| layouts        | ページ全体のレイアウト      |
| pages          | ページ用 vue コンポーネント |
| store          | vuex 用                     |

てな感じらしい.

また, [ルーティング - NuxtJS](https://ja.nuxtjs.org/guide/routing) によると, 

pages ディレクトリ以下の *.vue ファイルはそれぞれ別のページになり, 勝手に vue-router に登録されるとのこと. べんり〜

その他にもざっと目を通しておく.

- [ビュー - NuxtJS](https://ja.nuxtjs.org/guide/views): ビュー(見た目)の全般的な説明
- [Vuex ストア - NuxtJS](https://ja.nuxtjs.org/guide/vuex-store): Vuex の有効化

とりあえずこの辺で.

## アクセスしてみる

[/](http://localhost:3000) にアクセスすると, 初期ページが表示された.

SSRの挙動を見るのが目的だったので, ｢ソースを表示｣ でHTMLソースを覗いてみる.

``` html
<div data-server-rendered="true" id="__nuxt">...</div>
```

SPAと違って中身がレンダリングされた状態のHTMLが表示されていたので, SSRは問題なくできているらしい.

先にも書いたように, nuxtでは, pages ディレクトリ下にあるコンポーネントが Vue-router に登録されて(ルーティングを持って)いる.

初期段階では, index と inspire ページがあった.

``` bash
$ tree pages
pages
├── README.md
├── index.vue
└── inspire.vue

0 directories, 3 files
```

実際, [/inspire](http://localhost:3000/inspire) にはアクセスできて, ページが表示された.

同様にソースを覗いてみると, index とは異なるレンダリングがされていたので, 

- vue-routerでのルーティングは, サーバーサイドで行う(SPAみたいに, click イベントを prevent してDOM書き換えるわけではない)
- 各ページは, 初期のDOM要素がレンダリングされた状態のHTMLがサーバーから渡される

てことで, 間違ってなさそう.
