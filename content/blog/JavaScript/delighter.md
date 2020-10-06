---
title: "CSSでスクロールアニメーション"
thumbnail: "/thumbnails/prog_g.png"
tags:
 - "CSS"
category: "JavaScript"
date: "2019-09-15T16:32:13+09:00"
weight: 5
draft: true
---

スクロールアニメーションの実装方法について調べたら良さそうなライブラリを見つけたのでメモ.

[Delighters](https://github.com/Q42/delighters)なるライブラリ(?)を使う.

## Usage

CDNやnpm, yarnでは提供されていないみたいなので, 何らかの手段でローカルにソースのスクリプト自体を保存して通常のjsファイルのように読み込む.

幸い1ファイルなので大した労力ではないはず.

``` bash
$ curl https://raw.githubusercontent.com/Q42/delighters/master/src/delighters.js > ./delighters.js
```

とりあえずcurlで拾ってくる.

``` html
<script type="text/javascript" src="delighters.js"></script>
```

で, あとは読み込めば準備完了.

## 動かす

まずは, アニメーションをつけるdiv要素を作る.

targetクラスを付与しておく(クラス名はなんでもおけ).

``` html
<div class="target" data-delighter>
  <span>Target Object</span>
</div>
```

アニメーションの設定は,

viewportの最上部を0, 最下部を1として, 0.75のラインに基準位置が設定されていて

この位置を基準に,

1. 初期状態
2. 要素の上辺が基準値に到達したときの状態
3. 要素の下辺が基準値に到達したときの状態

の3状態間を指定しておいて, アニメーションを起こす.

### 1. 初期状態

``` css
.target.delighter {
  /* 1 -> 2, 2 -> 3のアニメーションの設定 */
  transition: all .3s ease; 

  /* 初期状態: X軸方向-100%の位置に透明度0 */
  transform: translateX(-100%);
  opacity: 0;
}
```

### 2. start

要素の上辺が基準位置に到達したときの状態.

``` css
.target.delighter.started {
  /* transformなしの位置に透明度1 */
  transform: none;
  opacity: 1;
}
```

### 3. 終了

要素の下辺が基準位置に到達したときの状態.

``` css
.target.delighter.ended {
  /* 外枠に赤い枠を表示 */
  border: solid red 10px;
}
```

これだけで完了.

あとはブラウザでスクロールをしてみると指定したエフェクトがついている.

あとは各状態のtranformをいじってあげるだけで, 種々のアニメーションは実装できる.

うぇい！