---
title: "Next.jsをSSGで配信するときの画像最適化について"
description: "まだ書いてません"
category: "Next"
tags:
  - "Next.js"
date: "2021-01-11T18:40:49Z"
thumbnail: "thumbnails/Next.png"
draft: true
---

<!-- canary ブランチでまだ tracedSVG が未対応なので、対応次第加筆して投稿する！！ -->

## TL;DR

画像最適化は、`next/image` が人気だけど、SSG モードだとできません

ローカルでビルド時に最適化する [cyrilwanner/next-optimized-images](https://github.com/cyrilwanner/next-optimized-images) はちょっと使いにくい & 型サポートがないって感じだったんですけど、canary バージョンでだいぶ改善されたので紹介します

- webp へ変換 & 配信
- tracedSVG (Gatsby とか、[Medium](https://medium.com/) でよく見るやつ)

## 準備

今回使うパッケージを取得します

```bash
$ yarn add next-compose-plugins next-optimized-images@canary webp-loader image-trace-loader
```

[Optimization Packages](https://github.com/cyrilwanner/next-optimized-images#optimization-packages) から必要なものを導入します

今回はとりあえず、webp 用 と tracedSVG 用のものをいれてます。

## 設定ファイルの準備

最低限の設定ファイルを準備します

```javascript:next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    /* config for next-optimized-images */
  }],

  // your other plugins here
], {
  // next config here
});
```

```json:.babelrc
{
  "presets": ["next/babel"],
  "plugins": ["react-optimized-image/plugin"]
}
```

```typescript:next-env.d.ts
/// <reference types="optimized-images-loader" />
```

## webp コンポーネントの利用

`react-optimized-image` コンポーネントで画像を埋め込みます

```tsx
import Img from "react-optimized-image";
import logo from "@images/logo.jpg";

export const LogoImage: React.FC = () => (
  <Img src={logo} sizes={[500, 2000]} alt="alt text" height={60} width={100} />
);
```

sizes は想定してるデバイスサイズで、

上の例なら、

- 〜500
- 501〜

用の 2 種類が生成されます

## tracedSVG

ほげほげ

## 終わりに

ここにサンプルを置いておくぜ

さよなら
