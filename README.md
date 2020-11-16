# Gatsby Tech Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/a8b255ab-2c70-44f4-bcc3-e0ec4faa4994/deploy-status)](https://app.netlify.com/sites/kimuson-dev/deploys)

[Gatsby.js](https://www.gatsbyjs.com/)で, 構築した技術ブログです.

## Links

- [kimuson.dev](https://kimuson.dev): デプロイ先
- [Netlify](https://www.netlify.com/): ホスティングサービス
- [gatsbyjs/gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog): ベースにしたスターター

## 開発サーバーを建てる

``` bash
$ yarn dev
```

記事を書くときも, ブログ自体を更新すろときもこちらの開発サーバーを使う

## 記事を書き始める

### Frontmatter

(work, aboutはまた別だが)ブログ記事のマークダウンファイルでは, 以下の形式をサポートする

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
draft: true
---

このブログでは, マークダウンで記事を書くことができます.
```

- category: ディレクトリ構造と同期する
- draft: 記事の公開/非公開 (開発環境では, 非公開ラベル付きで表示されるが本番環境では表示されない)

サムネイル画像については,

| frontmatter | ファイルのパス |
| :---: | :---: |
| thumbails/\*.png | content/assets/thumbails/\*.png |
| /blog/article-name/\*.png | content/blog/article-name/\*.png |

のように, サムネ用フォルダに置く場合と, 記事のディレクトリに置く場合の2種類がある.

一般にサムネ画像を準備するのはめんどうなので, カテゴリ毎に用意したサムネ画像を `thumbnails` から引っ張ってくる.

記事特有のサムネイル画像を適用する場合には, 後者の方法を使う

### 記事ファイルを生成する

記事ファイルの `Frontmatter` を毎回書くのは大変なのでスクリプトを用意してある

``` bash
$ yarn post:new
yarn run v1.22.4
$ git rev-parse --show-toplevel && ./bin/create.sh
/path/to/blog-name
記事タイトルを入力してください >> テスト記事
ファイル名を入力してください >> test.md
カテゴリを入力してください
既存のカテゴリは以下です

tutorial        Django          Gatsby

カテゴリ名 >> tutorial
content/blog/tutorial/test.mdに記事ファイルを作成しました
✨  Done in 10.85s.
```

## GraphQLスキーマに応じてTypeScript型定義ファイルを生成する

GraphQL スキーマに変更があるたびに, 以下のコマンドで型定義ファイルを生成します.

``` bash
$ yarn codegen
```

生成先: [types/graphql-types.d.ts](./types/graphql-types.d.ts)

<details>
<summary>【非推奨】`onSave` で型定義ファイルを自動生成する</summary>

ホットリロードが重くなって, 型定義をわざわざ作り直す必要がないタイミングでのDXがとても落ちるのでおすすめはしないけど,

``` bash
$ yarn dev:codegen
```

で開発サーバーを立てれば, 型定義ファイルも自動生成できる
</details>
