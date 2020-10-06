---
title: "Webpack Dev Serverでコードを整形する"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "webpack"
  - "Sass"
category: "フロントエンド"
date: "2020-08-03T16:33:44+09:00"
weight: 5
draft: true
---

Webpack Dev Serverで ESLint, Stylelint, Prettierの自動整形をまわす.

[LP制作でもWebpackを挟みたい](./webpack_lp.md) の続き.

WebpackDevServerに, リンターと整形フロー挟んでいこうみたいな.

## eslint

`JavaScript` を解析して良くないところ(未使用の変数が定義されてるよ, シンタクスエラーがあるよ, ...etc)
を教えてくれるツール.

一部に関しては, 自動修正も可能.

## stylelint

eslintの `CSS` 版.

## prettier

コード整形ツール.

上の2つと違って, コードスタイル(好み)に合わせてコードを書き換えてくれるもの.

文字列には, ダブルクォーテーションを使おうとか, 文末にセミコロンは置かないとか, そういうのを統一できる.

## ビルドフローで自動整形したい

前者2つで逐一解析を入れればコーディングが捗るし, スタイルが統一されていると見やすいからファイル更新と同時に逐一これらを回したい.

VSCodeのプラグインを使って, ファイルが保存されたときに整形する記事が結構見つかるけど,
エディタの種類とか設定に依存するのが嫌だったので, Webpack Dev Serverのビルドフローに挟むことにした.

prettierは, eslint と stylelint の上で動作させる.

### ESLintの設定

``` javascript
// .eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "project": "./tsconfig.json"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "no-console": "off"
  }
}
```

TypeScriptを使うので, パーサーと `tsconfig.json` を指定しつつ, ルールを entend する.

`eslint` や `stylelint` にも, `prettier` で担当するようなルール(前述のセミコロンとか, etc)があって,
こういうコードスタイルに関するルールを打ち消して `prettier` の設定で上書きするのが,
`prettier plugin` なので, これは最後に書いてあげる.

### Stylelint

``` javascript
// .stylelintrc.js
module.exports = {
  extends: [
    "stylelint-config-recommended",
    "stylelint-config-standard-scss",
    "stylelint-prettier/recommended"
  ],
  plugins: [
    "stylelint-scss",
    "stylelint-prettier"
  ],
  rules: {
    "prettier/prettier": true
  }
}
```

`eslint` 同様に, `prettier` は最後に.

### Prettier

``` javascript
// .prettier.js
module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  arrowParens: 'always'
}
```

### Webpackの設定

``` javascript
// webpack.config.js
module.exports = {
  ...
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: false
            }
          },
          {
            loader: "eslint-loader",
            options: {
              // eslint config
              enforce: 'pre',
              configFile: path.resolve(__dirname, '.eslintrc.js'),
              cache: true,
              fix: true
            }
          }
        ],
        exclude: /node_modules/
      },
      ...
    ]
  },
  ...
  plugins: [
    ...
    new StyleLintPlugin({
      // stylelint config
      files: ['**/*.scss'],
      syntax: 'scss',
      fix: true
    })
  ]
}
```

`eslint-loader` と `style lint plugin` に fix オプションをつけて, 自動整形ができるようになった.

CUIからリントしたいときは,

``` bash
$ yarn run eslint **/*.ts -c .eslintrc.js --fix
$ yarn run stylelint **/*.scss --syntax scss --fix
```

みたいに, `option` で渡してる情報を渡してあげれば良いだけ.
