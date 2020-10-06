---
title: "読書メモ WEB制作者のためのCSS設計の教科書 ①"
description: "WEB制作者のためのCSS設計の教科書を読んだので感想を書きます。"
thumbnail: "/thumbnails/読書.png"
tags:
  - "CSS"
category: "読書メモ"
date: 2019-12-07T14:23:31+09:00
weight: 5
draft: true
---

[Web制作者のためのCSS設計の教科書 モダンWeb開発に欠かせない「修正しやすいCSS」の設計手法](https://www.amazon.co.jp/dp/B00M0ESXUI/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)
の読書メモ.



1. CSS設計の話
2. Sassの話
3. Web Component

にわけてかく.



## 指針

自由に簡単にかけるがゆえに設計が破綻しやすいCSSをできるだけ修正に強く設計しよう...

## いろいろ

- 大きなルール + 取り消しルールではなく, 小さなルールの結合
- 絶対値より相対値を意識(line-height: 1.5とかとか)
- 場所に依存しないCSSを書く
  - タグに直接スタイルを当てない
  - IDセレクタNG
  - 不要な依存セレクタの省略(ul > li > a => ul > a)

などなどを意識しよう.

## 詳細度

1. !important
2. style属性
3. IDセレクタ
4. クラスセレクタ, 属性セレクタ(\[class="sample-class"]), 擬似クラス(button:first-child)
5. 要素セレクタ

の順で詳細度は計算され, 詳細度が高いルールが適用される.

詳細度が複雑化すると, 修正しにくい(上書きしたいときに!importantとかに逃げがち)CSS設計になってしまう.

IDセレクタを避ける(or代わりに属性セレクタを用いる)等して, 詳細度が高くならない, 複雑化しないCSS設計を意識しよう.

## オブジェクト指向CSS

関心の分離はプログラミングにおいて重要な考え方だけど, CSSじゃどうやるの?って話.

オブジェクト指向CSSの考え方を使う.

**オブジェクト指向CSS** では,

- 基本構造と見た目を分離
- コンテナとコンテンツを分離

が基本軸で, HTML要素に1クラスを割り当てて直接スタイルを書くのではなく,

部品化された複数のクラスを組み合わせることでスタイリングしようてきな.

``` css
.error_message {
  font-weight: bold;
  color: red;
}

.status_message {
  font-weight: bold;
  color: blue;
}
```

みたいなのを,

``` css
.message {
  font-weight: bold;
}

.error {
  color: red;
}

.status {
  color: blue;
}
```

みたいな.

## SMACSS

カテゴライズ

1. Base
     - 要素(タグ)のデフォルトCSSの指定
2. Layout: l-*
     - サイトの大枠
     - Grid Layoutみたいなイメージ
3. Module: m-*
     - 再利用可能なオブジェクト
4. State: is-*
     - JSが関与するような状態に関するもの
     - 特殊状態なので詳細度が一番高いもの => !important推奨
5. Theme: theme-*
     - テーマ切り替え的な

### 命名に関して

抽象度の高いクラス名は避ける

=> 継承前提なら継承元のクラス名を含める

**.alert-message** みたいな.

## BEM

BEM => **B** lock, **E** lement, **M** odifier

- Block: 再利用可能なクラス
- Element: Block内部で使うような要素, alert => title, description みたいな
- Modifer: Blockを継承するStateっぽいもの

``` html
<div class="alert alert_warning">
  <h2 class="alert__title">Hello World</h2>
</div>
```

命名規則によってElement(\*_\*)とModifer(\*__\*)を明確に分離することができる.

## MCSS: Multilayor CSS

OOCSSとBEMを元に作られたコンセプト.

### Layor

1. Foundation
    - デフォルトCSSの適用, SMACSSでいうBase
2. Base
    - 再利用可能な(抽象化された)要素, SMACSSでいうModule
3. Project
    - 実際にページを構成する具体的な要素
4. Cosmetic
    - ⇑の範囲外のもの, 特殊なリンクの色やdisplay: noneとかとか
5. Context
    - 例外的なもの, メディアクエリ, イベント中など

上層 → 下層は上書きできるが, 逆はできないようにする
