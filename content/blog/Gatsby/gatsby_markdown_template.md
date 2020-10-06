---
title: "Gatsbyブログで記事マークダウンファイルをテンプレートから自動生成する"
description: Gatsbyのブログでマークダウン記事ファイルを自動生成するシェルスクリプトを書きました。
category: "Gatsby"
tags:
  - ブログ
  - Gatsby
date: "2020-10-05T09:15:22Z"
thumbnail: "thumbnails/Blog.png"
draft: false
---

<!-- [Gatsbyで技術ブログを作りました！](../gatsby-blog/) で書きましたように, このブログはGatsbyで構築されています. -->

Gatsbyとマークダウン記事の構成でブログを作っている場合, 新しい記事を書くときにマークダウンファイルを用意するのは若干手間だったりします.

例えば, このブログでは,

``` markdown
---
title: Gatsbyで技術ブログを作りました！
description: Gatsby+TypeScriptで技術ブログを作りました。苦労した点などをまとめます。
category: Gatsby
tags:
  - Gatsby
  - React
date: "2020-08-30T22:40:32.169Z"
thumbnail: 'thumbnails/Blog.png'
draft: true
---

技術ブログを Hugo から, Gatsyby.js に乗り換えて, リニューアルしました！
...
```

こんな感じのマークダウンファイルから記事が作られています.

新しく記事ファイルを作ろうと思うと,

指定のディレクトリ(僕の場合はカテゴリと同名ディレクトリを準備してそこに記事ファイルを置いています)に記事ファイルを置き, 現在時刻をどこかから拾ってきて貼って, ...etc みたいなことをする必要があって結構めんどくさいので自動化しちゃえっていう内容です.

## 環境

あまり凝って作るつもりはないので, シンプルに `bash` で書いて, `package.json` の scripts に差し込みます. 関連するランタイムの環境を貼っておきます.

``` bash
$ node -v
v14.6.0

$ yarn -v
1.22.4

$ bash --version
GNU bash, version 3.2.57(1)-release (x86_64-apple-darwin19)
Copyright (C) 2007 Free Software Foundation, Inc.
```

Gatsbyのディレクトリ構造は以下の通りです.

``` bash
$ tree -I "node_modules|static|src|public"
.
├── LICENSE
├── README.md
├── bin
│   ├── create.sh
│   └── template.md
├── codegen.yml
├── content
│   ├── assets
│   │   └── thumbnails
│   │       └── Blog.png
│   └── blog
│       ├── Django
│       │   └── xxx.md
│       ├── Gatsby
│       │   └── yyy.md
│       └── tutorial
│           └── zzz.md
├── gatsby-browser.js
├── gatsby-config.js
├── gatsby-node.js
├── package.json
├── tsconfig.json
├── types
│   ├── declaration.d.ts
│   └── graphql-types.d.ts
└── yarn.lock
```

## マークダウンテンプレートを準備する

まずは, ベースとなるマークダウンファイルを `bin/template.md` に設置します.

``` bash:title=bin/template.md
---
title: "@TITLE"
description: まだ書かれていません
category: "@CATEGORY"
tags:
  - ブログ
  - Gatsby
date: "@DATE"
thumbnail: "thumbnails/@CATEGORY.png"
draft: true
---

```

とりえあずこんな感じで, `@HOGE` の部分を入力から受け取って置換してあげるイメージです.

## 記事ファイル作成用スクリプトの準備

`bin/content.sh` に記事ファイル作成 & Frontmatter置換用のスクリプトを書いていきます.

やることは,

1. `bin/template.md` をコピってくる
2. テンプレートの一部を置換する

だけです.

``` bash:title=bin/create.sh
#!/bin/bash

printf "記事タイトルを入力してください >> "; read TITLE
printf "ファイル名を入力してください(sample.md) >> "; read FILENAME
printf "カテゴリを入力してください\n"
printf "既存のカテゴリは以下です\n\n"
ls -r content/blog/
printf "\nカテゴリ名 >> "; read DIRNAME

EXTENSION=$(echo $FILENAME | cut -f 2 -d .)

if [ $EXTENSION != "md" ]; then
  FILENAME=${FILENAME}".md"
fi;

FILEPATH="content/blog/$DIRNAME/$FILENAME"

if [ ! -d content/blog/$DIRNAME ]; then
  mkdir content/blog/$DIRNAME
fi
cp bin/template.md $FILEPATH

CURRENT_TIME=$(date +"%Y-%m-%dT%TZ")
function replaceTemplate() {
  # $1 > $2 で置き換える
  # Example: replaceTemplate @DATE $DATE
  sed -i -e "s/$1/$2/g" $FILEPATH
}

# Replace
replaceTemplate @TITLE $TITLE
replaceTemplate @DATE $CURRENT_TIME
replaceTemplate @CATEGORY $DIRNAME
\rm $FILEPATH-e

printf "$FILEPATHに記事ファイルを作成しました"
```

こんな感じの実装になってます.

## package.json に指す

先程作成した `bin/create.sh`に実行権限を付与してあげつつ,

``` bash
$ chmod a+x bin/create.sh
```

手打ちしやすいように, `package.json` の scripts に追加しておきます.

``` json:title=package.json
{
  ...
  "scripts": {
    ...
    "post:new": "git rev-parse --show-toplevel && ./bin/create.sh"
  }
}
```

これで完成です.

``` bash
$ yarn post:new
$ npm run post:new
```

でスクリプトを起動できます.

## 使ってみる

試してみます.

パッケージマネージャは, `yarn` を使っているのでそちらで.

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

記事ファイルが作成されました.

中身を見てみます.

``` markdown:title=content/blog/tutorial/test.md
---
title: "テスト記事"
description: まだ書かれていません
category: "tutorial"
tags:
  - ブログ
  - Gatsby
date: "2020-10-05T09:17:32Z"
thumbnail: "thumbnails/tutorial.png"
draft: true
---

```

意図通りに動いているのがわかります.

てことで, 簡単ではありますが記事ファイルの自動生成についてでした.

閲覧ありがとうございました.
