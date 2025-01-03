---
title: "GASをwebpackでビルドして管理する"
description: "GASをwebpackでビルドすることで、ライブラリのインポートに対応します。"
category: "GAS"
tags:
  - GAS
date: "2021-01-13T16:12:01Z"
thumbnail: "thumbnails/GAS.png"
draft: false
---

## TL;DR

Google Apps Script(以下、GAS)は、手軽に色々できて便利なんですけど、開発環境周りがしんどいです

一応、[google/clasp](https://github.com/google/clasp) を使って、

- ローカルに持ってきてお好きなエディタで
- TypeScript で書ける

って感じにはできますが、ファイルを跨いだインポートができません。これがまじで致命的で。

外部のパッケージを使えないのはまだ良いとしても、複数の GAS プロジェクトを跨いだ部品の共通化とかもできません。

例えば、Slack に通知するなら Slack クライアントは共通部品になるけど、そういうのもプロジェクト毎に書かないといけないわけです。

一応ライブラリっていう他のプロジェクトの関数を利用できる機能はあるんですが、GAS からポチポチするとグローバルの名前空間にライブラリの関数が追加される形なので、あまり好ましくないです。

でまあ、『ブラウザ版 JS にモジュールがないから無理矢理バンドルしちゃえ！』って webpack のアプローチがこっちでもできるので、やっていきます

Node 依存の実装を使ってないライブラリなら外部パッケージも利用できます。

## ディレクトリ構成

ディレクトリ構成はこんな感じです

```bash
$ tree . -L 3 -I node_modules
.
├── @types
│   ├── globals.d.ts
│   └── vendor.d.ts
├── bin
│   ├── clone.sh
│   └── push.sh
├── jest.config.js
├── lib
│   └── # 共通化した部品
├── package.json
├── projects
│   ├── project1  # GASプロジェクト①
│   │   ├── appsscript.json
│   │   ├── dist
│   │   └── index.ts
│   └── project2  # GASプロジェクト②
│       ├── appsscript.json
│       ├── dist
│       └── index.ts
├── tests
│   ├── # テスト
│   └── tsconfig.json
├── tsconfig.json
└── webpack.config.js
```

project1, project2 のように projects 下に gas プロジェクトを配置していって、それぞれのディレクトリ下の dist にバンドルを吐き出します

私の場合は、

- Trello の API クライアント
- Slack の outcoming webhook によるメッセージ送信
- DB 代わりのスプレッドシート (利用メンバー一覧とメタ情報, etc)

とかとかを lib に切り分けていて、必要に応じて利用できるようにしてあります

## webpack 設定を書く

[GitHub - fossamagna/gas-webpack-plugin: Webpack plugin for Google Apps Script](https://github.com/fossamagna/gas-webpack-plugin)

こちらを使って、GAS 向けにビルドができます

必要なパッケージを取得します

```bash
$ yarn add -D webpack copy-webpack-plugin gas-webpack-plugin typescript ts-loader
```

`projects/<ProjectName>/index.ts` を自動的に webpack のエントリにする形で、webpack 設定を書きます

```typescript:webpack.config.js
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');

const projectsPath = path.resolve(__dirname, 'projects')

const targets = fs.readdirSync(projectsPath, { withFileTypes: true })
  .filter(path => path.isDirectory() && !path.name.startsWith('.'))
  .map(path => path.name)

const entries = {}
targets.forEach(dirName => {
  entries[dirName] = path.resolve(projectsPath, dirName, 'index.ts')
})

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    path: path.resolve(projectsPath),
    filename: "[name]/dist/bundle.js",
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json')
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        ...targets.map(dirName => ({
          from: `projects/${dirName}/**/*.json`,
          to: `${dirName}/dist/[name].[ext]`
        })),
      ]
    }),
    new GasPlugin(),
  ],
};
```

これで、ビルド(`$ webpack`) すると、各 GAS プロジェクトディレクトリ下に GAS に読ませる用の `dist` が生成されます

## GAS 用の型定義を適用する

GAS 依存の関数等の型定義は `@types:google-apps-script` で提供されます

```bash
$ yarn add -D @types/google-apps-script
```

型定義には、console の名前重複問題があるので、対策が必要です

[[@types/google-apps-script] Variable 'console' must be of type 'Console', but here has type 'console'. TS2403 · Issue #32585 · DefinitelyTyped/DefinitelyTyped · GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32585)

こちらの Issue で示されてるように、`$ npm install` のタイミングで `console` をコメントアウトします

```json:package.json
{
  "scripts": {
    "postinstall": "replace-in-file \"declare var console\" \"//declare var console\" node_modules/@types/google-apps-script/google-apps-script.base.d.ts",
  }
}
```

## GAS プロジェクトをクローンする

準備はできたので、GAS プロジェクトを引っ張ってきます

```bash
$ yarn add -g clasp
```

初利用なら、[GAS のユーザー設定](https://script.google.com/home/usersettings) から `Google Apps Script API` を有効化する必要があります

クローン用のスクリプトを準備しておきます

```bash:bin/clone.sh
#!/bin/bash

printf "Input Project Name >> "; read project_name

mkdir ${project_name} && cd ${project_name} && touch index.ts
clasp clone --rootDir './dist'
```

```json:package.json
{
  "scripts": {
    // ...
    "clone": "bin/clone.sh",
  }
}
```

これで、`$ yarn clone` すれば GAS プロジェクトを引っ張ってこれます

```bash
$ yarn clone
yarn run v1.22.10
$ bin/clone.sh
Input Project Name >> hoge
? Clone which script? # 対象のプロジェクトを選ぶ
Warning: files in subfolder are not accounted for unless you set a '.claspignore' file.
Cloned 2 files.
└─ ./dist/appsscript.json
└─ ./dist/コード.js
Not ignored files:
└─ dist/appsscript.json
└─ dist/コード.js

Ignored files:

✨  Done in 11.52s.
```

## プロジェクトを push する

同様に push 用スクリプトを置きます

```bash:bin/push.sh
#!/bin/bash

yarn build && cd projects/$1 && clasp push
```

```json:package.json
{
  "scripts": {
    // ...
    "push": "bin/push.sh",
  }
}
```

これで、`$ yarn push <ProjectName>` すれば反映できます

```bash
$ yarn push hoge
yarn run v1.22.10
$ webpack
[webpack-cli] Compilation finished
# ...
└─ dist/appsscript.json
└─ dist/bundle.js
Pushed 2 files.
✨  Done in 29.15s.
```

## gas プロジェクトに実行可能な関数を生やす

global に生やした関数が gas から実行できる関数になります

```typescript:index.ts
global.gasFunc = () => {
  console.log('hello world')
}
```

一応これで `$ clasp push` すれば `gasFunc` を実行することができますが、型の問題があります

```typescript:@types/vendor.d.ts
export {}

type Any = any

declare global {
  namespace NodeJS {
    interface Global extends Any { }
  }
}
```

無理矢理だけど、こんなんで通ります

## その他いろいろ

### 単体テストをちゃんとする

- GAS は、ランタイムをローカルに作れない
- webpack はヒューマンリーダブルなコードを吐き出さないので GAS エディタ上でのデバッガを利用できない

って感じなので、動作確認しようと思ったら、いちいち GAS にあげて console.log でデバックするしかありません

つまり、単体テストをちゃんと書かないと開発効率が死にます

GAS 依存の実装(`UrlFetchApp.fetch()`, `SpreadsheetApp.openById()`, えとせとらえとせとら)からデータなりを取り出す部分とそれ以外のロジックをしっかり切り分けておき、後者をローカルのランタイムでテストできるようにしておくことが大事です

じゃないとまじでコードベースが増えてきたときにしんどいです

### ソースコードに載せられない情報を置く

API のキーとか、ソースコードに書くべきでない値は、`ファイル > プロジェクトのプロパティ > スクリプトのプロパティ` にキーとバリューのセットで置いておいて、以下の形で取得できます

```typescript
const props = PropertiesService.getScriptProperties().getProperties();
props.API_KEY; // でアクセスできる
```

※ 最近 GAS のエディタが新しくなりまして、新エディタだとこれがないっぽいです。一時的に旧エディタに戻せば使えます

## 終わりに

[d-kimuson/gas-webpack-workspace-boiler](https://github.com/d-kimuson/gas-webpack-workspace-boiler)

一応使ってるソースから汎用的でないソースを外したリポジトリを用意したので、パッケージのバージョン情報等はこちらを参照してください
