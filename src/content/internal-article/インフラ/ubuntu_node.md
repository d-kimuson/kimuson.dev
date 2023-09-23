---
title: "Ubuntu サーバーで npm install するとサーバーが死ぬことへの対策"
thumbnail: "thumbnails/インフラ.png"
tags:
  - "npm"
  - "Node.js"
category: "インフラ"
date: "2019-09-12T17:40:27+09:00"
weight: 5
draft: false
---

## npm install でサーバーが死んだ

ubuntu の VPS 借りて

```bash
$ npm install
```

でサーバーからの返答がなくなった

何回か再起動してやってみても毎回死ぬ

## 原因と対策

メモリが足りなくて処理が終わらなく成るらしい

参考: [node.js - NPM Install with package.json exits during extract --> gunzTarPerm with no error message](https://www.oipapio.com/question-7118750)

なるほど。

スワップファイルを作成すること対処方が提案されていたので、

[How To Add Swap on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04)

を参考に

```bash
$ sudo dd if=/dev/zero of=/swapfile bs=1G count=4
$ sudo fallocate -l 4G /swapfile
$ sudo chmod 600 /swapfile
$ sudo mkswap /swapfile
$ sudo swapon /swapfile
```

すると、問題なくインストールできた
