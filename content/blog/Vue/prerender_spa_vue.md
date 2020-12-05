---
title: "Vue の SPA をプリレンダリングする"
thumbnail: "thumbnails/Vue.png"
tags:
  - "Vue.js"
category: "Vue"
date: "2020-07-17T08:27:14+09:00"
weight: 5
draft: false
---

SPAのプリレンダリングというものを知ったので、試してみた

SPAの欠点としてよく、レスポンスで空 div を投げることがあげられる。

対策としてSSRがあげられるけど、そんなめんどいことしなくても
最初にアクセスしたときに生成されるDOMをそのままコピればいいだけじゃね? って思って調べてたら Prerender なるものをみつけた。まさにこれだ。

よくみたら、Vueの公式サイトでも紹介されてた。

[Vue.js サーバサイドレンダリングガイド #SSR vs プリレンダリング (事前描画) \| Vue SSR ガイド](https://ssr.vuejs.org/ja/#ssr-vs-%E3%83%97%E3%83%AA%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0-%E4%BA%8B%E5%89%8D%E6%8F%8F%E7%94%BB)

> もしあなたが、幾つかのマーケティングのページの SEO を向上させるためだけに SSR を調べているとしたら (たとえば `/`、`/about`、`/contact` など)、代わりに プリレンダリング (事前描画) を使用することをオススメします。 HTML を急いでコンパイルするために Web サーバーを使用するのではなく、プリレンダリングは、ビルド時に特定のルートに対して静的な HTML ファイルを生成します。利点はプリレンダリングを設定する方が遥かに簡単で、フロントエンドを完全に静的なサイトとして保つことができることです。

最高やん。

てことで、やってみる

## Prerender SPA Plugin

[GitHub - chrisvfritz/prerender-spa-plugin: Prerenders static HTML in a single-page application.](https://github.com/chrisvfritz/prerender-spa-plugin)

プリレンダリングするためのプラグインで、Vue、React、Angular に対応している

Vue用は、CLIプラグインがあったので、こっちを使った。

[vue-cli-plugin-prerender-spa - npm](https://www.npmjs.com/package/vue-cli-plugin-prerender-spa)

``` bash
$ vue add prerender-spa
```

各質問に答え終わると、`vue.config.js` に設定が追加される.

``` javascript:vue.config.js
module.exports = {
  ...
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/services',
        ...
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
    }
  }
}
```

ビルドして、index.html のソースを覗くとちゃんと中身があった。 感動 😭

## Web Font Loader への対応

ウキウキでホスティングしてみたら、使用前より Lighthouse のパフォーマンススコアが落ちてた

70 => 55くらい

ビルドされたHTML覗いてみたら、Google Fontの読み込みが二重になってた

[Web Font Loader](https://github.com/typekit/webfontloader) が、後から挿入してる読み込みタグがビルド時にも生成されて重複してるっぽい。

なるほど、そりゃそうか。

[vue-cli-plugin-prerender-spa の公式](https://www.npmjs.com/package/vue-cli-plugin-prerender-spa) を確認してみたらカスタマイズの方法が載ってたので、参考にしつつ除去する

``` javascript:vue.config.js
module.exports = {
  ...
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/services',
        ...
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      postProcess: route => {
        route.html = route.html
          .replace(/<link rel="stylesheet" href="https:\/\/fonts.googleapis.com(.*?)>/g、'');
        return route;
      }
    }
  }
}
```

再ビルドしてみたら無事除去されてて、今度はスコアも80超えてた

わーい
