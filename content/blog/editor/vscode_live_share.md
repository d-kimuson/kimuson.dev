---
title: "VSCodeでライブシェアリング"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "VSCode"
category: "editor"
date: "2020-03-02T11:27:13+09:00"
weight: 5
draft: true
---

就活で面談をしていたらエンジニアの方に VSCode の Live Sharing 機能がペアプロ・モブプロに良いよ！って教えてもらったので使ってみます.

## 環境

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.3
BuildVersion:   19D76
```

[Visual Studio Live Share とは](https://docs.microsoft.com/ja-jp/visualstudio/liveshare/) によると,

- Mac OS 10.13以降
- VSCode 1.22以降

が必要だそうです.

昔使ってた Mac と共有してみようと思ったけど, OSのバージョンが古すぎて無理だった(;_;)

2012年モデルだし, 今更 Catalina にするのもなぁ...

## セットアップ

1. VSCode の拡張機能 Live Share をインストール
1. 画面左下に Live Share の文字が表示されるのでクリック, Authenticate in Github で認証

## シェアする

画面左下の Live Share をクリックすると, 招待リンクがコピーされるので,

あとは, 参加者にリンクを渡して, 踏んでもらえば参加できます.

## 実際に外からコードを書いてみる

友達とでも試せばいいかなと思ったんですが, せっかくなので お古のMacにも Catalina 入れましたw

招待リンク踏むと, ブラウザに ｢VSCode 開くで｣ 的なこと言われるんで従ってると編集ができるようになりました.

これまで勉強会とかでモブプロっぽいことするときは, VNCで共有とかしてたんですけどこれは便利でいいっすね

積極的に使っていこうと思います.
