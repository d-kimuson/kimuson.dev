---
title: "LP制作でもWebpackを挟みたい"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "JavaScript"
  - "Node.js"
  - "Html"
category: "フロントエンド"
date: "2020-07-15T00:17:15+09:00"
weight: 5
draft: true
---

LP用にぼくのかんがえたさいきょうのWebpackConfigみたいなのつくる.

## 目的

LPを構築する機会があって,

Vueとか使うほどでもないし, じゃあプレーンなHTML, CSS, JavaScriptを使って構築する? でも, HotReloadがないの不便だなとか, CSS直書きとかしんどいなとか, 色々不満があったから, 勉强も兼ねてWebpackの設定書いてみる.

リポジトリ: [GitHub - kaito1002/ts-sass-postcss-boiler: personal typescript & sass & postcss boiler plate](https://github.com/kaito1002/ts-sass-postcss-boiler)

## Webpackとはなにか

一応.

Webpackは, 現在最も使われている **モジュールバンドラ**

Node.jsでは, モジュールがサポートされていたけど, ブラウザのJSランタイムはそのへんがなくて(今は一応対応したけど), じゃあ依存関係解決して単一のビルドファイル作ればいいじゃんってのりで生まれたのがモジュールバンドラくん.

でまあ, LP程度の規模感の開発において, わざわざ `Webpack` をかませる必要があるのかって話だけど,

- Hot Reload
- 構文解析を入れられるので, エラーメッセージを通じてデバッグが捗る
- SASS, PostCSS, TypeScriptの利用

この辺のメリットがあるかなと思っていて, Hot Reloadが入るだけでも開発のストレスが減るし(これだけならParcelでもいいけど), トランスパイラ介してよりTSなりSASSなりを利用できることはメリットだと思う.

設定書くのはめんどいけど, 使い回せるし.

てことで書いてく.

## 設定を書いていく

バージョンはリポジトリに書いてあるのでそちらを.

**webpack.config.js** を準備する.

``` javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const buildDir = "dist";

const baseConfig = {
  entry: { main: "./src/index.ts" },
  output: {
    path: path.resolve(__dirname, buildDir),
    filename: "[name].bundle.js",
    pathinfo: false
  },
  devtool: "inline-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
          enforce: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: []
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
          }
        ]
        exclude: /node_modules/
      },
      {
        test: /\.(s?)css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[name].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    })
  ]
};

const devConfig = Object.assign({}, baseConfig, {
  devtool: "eval-sourcemap",
  devServer: {
    contentBase: [
      path.join(__dirname, "src")
    ],
    watchContentBase: true,
    overlay: true
  }
})

const productConfig = Object.assign({}, baseConfig, {
  devtool: false,
  plugins: [
    new CleanWebpackPlugin([buildDir + "/*.*"], {}),                   // 既存のファイルを削除
    ...baseConfig.plugins,                                             // ビルド
    new CopyWebpackPlugin([{ from: "./src/assets", to: "./assets" }])  // assetsのコピー
  ]
})

module.exports = (env, options) => {
  const production = options.mode === "production";
  const config = production
    ? productConfig
    : devConfig

  return config;
};
```

プロダクションモードと開発モードにわけて, 基本的なWebpackの設定が書いてある.

- `src/index.html` => `dist/index.html` にビルドされる
- CSSは, JSにはバンドルされず, `style.main.css` にビルドされる
- TypeScriptソースは, `src/index.ts` を起点に `main.bundle.js` に, ライブラリは, `vendor.bundle.js` にバンドルされる

ペタペタとつけたしていく.

## ネイティブCSSより, SASS + PostCSSを使いたい

一般に, 開発者がメンテナンスするCSSと, 成果物としてのCSSは求められる性質が異なる

メンテナンス対象のCSSは, メンテナンスのしやすさが重要であり,

- 変更に強い書き方
- 可読性
- 適切なコメント
- ..etc

が求められる.

一方で, 成果物としてのCSSは,

- 適用範囲が広いこと
- 読み込み速度の最適化のため, サイズが小さいこと

が重要であり, この両方を満たすようにCSSを組んでいくのは無理がある.

そもそもプログラム的な機構がないので, 抽象化しにくいし, 変更に強く書くこと自体が難しいし, `Runtime` がユーザーごとに異なることから, 最終成果物はベンダープレフィッを多様するか, ブラウザを見捨てるかすることになるし.

だったら, より高級な言語から, 最終成果物としてのCSSをビルドしてあげればいいじゃんってことで, SASSとPostCSSを使う.

### Sass

[SASS](https://sass-lang.com/) は, CSSのプリプロセッサ(つまり, CSSを生成できるより高級な言語).

SASS記法と, SCSS記法があるけど, 今回はSCSS記法を前提とする.

構文は, CSSの拡張で,

- プログラム的な構文のサポート(演算, 変数, ループ, 関数, 継承等)
- 独自コメントがあり, ビルド時にコメントが削除される
- 入れ子構文で見やすい & BEMネイティブにかける

的な良さがある(BEMの`&`記法については賛否あるみたいだけど).

例えば, 以下はよくある固定ヘッダとフッターのレイアウトだけど, 演算と変数が使えることによって, 変数の値を変えるだけでコンセプトを崩さないまま, ヘッダーやフッターの高さを調節できる例.

``` scss
$header-height: 150px;
$footer-height: 150px;

.l-header {
    position: sticky;
    top: 0;
    left: 0;
    height: $header-height;
}

.l-content {
    margin: $header-height 0 0 0;
    min-height: calc(100vh - (#{$header-height} + #{$footer-height}));
}

.l-footer {
    height: $footer-height;
}
```

### PostCSS

[PostCSS](https://postcss.org/) は, CSSからCSSを生成するパーサー.

今回は, SCSSでトランスパイルしたCSSを入力し, PostCSSで最終的なCSSを生成する.

必要に応じてプラグインを用いることで, 最終成果物としてのCSSをカスタマイズすることができる.

- Autoprefixer: Can I Useに基づいて, ベンダープレフィックスの自動付与
- Cssnano: CSSの圧縮
- PurgeCSS: 未使用CSSの削除

などのプラグインがある.

設定は, `webpack.config.js` に直接書いてもいいけど, 再利用しやすいほうが好みなので `postcss.config.js` に書いておく.

``` javascript
// postcss.config.js
module.exports = {
  sourceMap: true,
  plugins: [
    require('autoprefixer')({
      grid: "autoplace"
    }),
    require('cssnano')({ preset: 'default' }),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/*.html'],
      css: ['./dist/*.css'],
      whitelistPatternsChildren: [/js-/],
    })
  ]
}
```

### Webpackの設定を更新する

SASSとPostCSSを噛ませられるように, `webpack.config.js` を修正する.

`baseConfig.module.rules` から `scss` ファイルのフローを更新する.

``` javascript
use: [
  "style-loader",
  {
    loader: "css-loader",
    options: {
      sourceMap: true,
      importLoaders: 2
    }
  },
  'postcss-loader',
  {
    loader: "sass-loader",
    options: {
      sourceMap: true
    }
  }
]
```

- PurgeCSS では, セレクタがHTMLにかかれていない場合に削除してしまうので, JSで操作するようなセレクタ用に `js-` プレフィクスを `whitelist` に登録する
- `autoprefixer` の指定バージョンは, package.jsonに記述する
- `css-loader` では, SASSとPostCSSを使うため `importLoaders: 2` を指定する

**package.json**

``` json
...
"browserslist": [
  "last 2 versions",
  "ie >= 11"
],
...
```

これでCSS周りは一通り設定が行えた！わーい！

具体的には, 以下のようにビルドが行われる(実際は改行とかも除かれるけど).

``` scss
.m-target {
    display: flex;
    color: green;
}

.m-target {
    // セレクタが重複しているので, cssnanoによって, 上記と結合される.
    font-size: 20px;
}

.m-target {
    // cssnanoによって削除される.
    color: green;
}

.hoge {
    // 未使用セレクタなので, PurgeCSSによって削除される.
    color: red;
}
```

⇓

``` css
.m-target {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 20px;
    color: green
}
```

## JavaScriptよりTypeScriptを使いたい

CSS同様に, JSも色々と不便が多いのでTypeScriptを使いたい.

### TypeScript

[TypeScript](https://www.typescriptlang.org/) は, JavaScriptにコンパイルできる **静的型付け** 言語.

SASS同様に, JavaScriptの拡張構文で構成され, 型に問題さえなければJSで動くものはそのまま動く(問題があってもAny型付与してあげれば動く)ので, 手軽に型の恩恵を享受できる😭😭😭

おまけ程度に, CSS同様に, 最終的なJSの形をカスタマイズしてあげる.

- console.logの自動削除(linterでよく怒られるけど, デバッグ用に残しておきたいからビルド時に除去したい派)
- コメントの削除

をしてもらう.

TypeScript 向けの設定はもう先の `webpack.config.js` に書いてあるので, プロダクションでコメントとconsole.logを除去する設定だけ追加してあげる.

``` javascript
const TerserPlugin = require("terser-webpack-plugin");

...

productConfig.optimization.minimizer.push(
  new TerserPlugin({
    terserOptions: {
      extractComments: 'all',
      compress: { drop_console: true }
    }
  })
)

...
```

これで, ビルド時に console.log とコメントが除去されるようになった.

## linterを用いて静的解析をはさみたい

静的解析用に eslint と stylelint を導入する.

### eslint

TSファイルのローダーに, eslint-loader を追加する.

``` javascript
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
      cache: true
    }
  }
]
```

ルールの設定は, `.eslintrc` に.

``` json
{
    "parser": "@typescript-eslint/parser",
    "extends": [
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        "no-duplicate-imports": "error",
        "no-var": "warn",
        "prefer-const": "warn",
        "no-console": "off"
    }
}
```

この辺は適当なので, 好みとかプロジェクトに合わせて.

加えて僕の環境だと, `webpack.config.js` 開いたときに VSCode君がいろいろちゃうでって怒るお節介をしてきたので, .eslintignore に `*.js` を指定しておいた.

### stylelint

`baseConfig.plugins` に `StyleLintPlugin` を追加して, プラグインにかませる

``` javascript
const StyleLintPlugin = require('stylelint-webpack-plugin');

...

plugins: [
  new HtmlWebpackPlugin({
    inject: false,
    hash: true,
    template: "./src/index.html",
    filename: "index.html"
  }),
  new StyleLintPlugin({
    // 設定ファイル: .stylelintrc
    // 詳細: https://stylelint.io/user-guide/configure
    // ルール: https://stylelint.io/user-guide/rules/list
    files: ['./src/styles/**.scss'],
    syntax: 'scss'
  })
]
```

**.stylelintrc**

``` json
{
  "rules": {
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-no-unknown": true,
    "selector-type-no-unknown": true,
    "media-feature-name-no-unknown": true,
    "declaration-block-no-duplicate-properties": [ true, { "severity": "warning" }],
    "declaration-block-no-shorthand-property-overrides": [ true, { "severity": "warning" }],
    "block-no-empty": [ true, { "severity": "warning" }],
    "no-duplicate-selectors":  [ true, { "severity": "warning" }]
  }
}
```

最初は, [GitHub - stylelint/stylelint-config-standard: The standard shareable config for stylelint](https://github.com/stylelint/stylelint-config-standard) を使ってみたんですが, だいぶ色々強制してきてうざかったから, あくまで手助け程度のだいぶゆるゆるな感じで, 最低限のルールだけ書いてる.

以上で, 終わりです.
