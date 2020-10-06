---
title: "Netlify で Vue Router のリロードに対応した話"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Vue.js"
  - "JavaScript"
category: "Vue.js"
date: "2020-03-31T15:22:49+09:00"
weight: 5
draft: true
---

友達が会社作るらしいんで, コーポレートサイトをSPAで作ってあげてたんですけど

各ページのルーティングに,
[Vue Router](https://router.vuejs.org/ja/)
を使っていて, NetlifyにデプロイするとWebサーバー側でルーティングを弾いて404返してしまっていました.

この辺って対応できないのかなーって調べてたら

[Syntax for the _redirects file  -- netlify Docs](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file)

に書いてありました.

配信されるディレクトリに, __redirects を置いて, 振り分けができるらしいです.

**public/__redirects**

``` txt
/* /index.html 200
```

これで, 全部 index.html にリダイレクトさせてあげられるのでページ制御を全て Vue Router に任せられます.

以上でほとんど対応できたんですが,
もう1段階ネストされたルーティング(http://example.com/news/1 みたいな)でまたリロードができなくなってました.

Chromeの仕様で, 直接叩くとJSの読み込みで相対パスを読んでしまっているらしいです(/js/hoge.js => /news/js/hoge.jsとして読んでしまう).

``` javascript
module.exports = {
    publicPath: '/',
    assetsDir: 'static',
}
```

vue.config.js から, CSSやJSファイルの書き出しを static ディレクトリからするように設定してあげることで無事対応できました.

以上になります.
