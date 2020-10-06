---
title: "UbuntuサーバーにNodeをいれるとサーバーが死ぬことへの対策"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "EC2"
  - "Node.js"
category: "JavaScript"
date: "2019-09-12T17:40:27+09:00"
weight: 5
draft: true
---

ubuntuサーバーにnodeを導入したらサーバーが死ぬ減少が起きてその対処法のメモ.

## Node.js と npmの導入

ついでなので, nodeとnpmの導入につかったスクリプトのメモ.

``` bash
$ sudo apt install -y nodejs npm
$ sudo npm install -g n
$ sudo n stable
$ sudo npm update -g npm
$ sudo npm cache clean --force
$ sudo apt purge -y nodejs npm
$ exec $SHELL -l
```

aptから取得して安定版へ更新.

## npm installでサーバーが死んだ

Githubでcreate-react-appしたアプリを共有してサーバー側でレンダリングしようと思ったら

``` bash
$ npm install
```

でサーバーからの返答がなくなった.

何回か再起動してやってみても毎回死ぬ.

## 原因と対策

メモリが足りなくて処理が終わらなく成るらしい.

参考: [node.js - NPM Install with package.json exits during extract --> gunzTarPerm with no error message](https://www.oipapio.com/question-7118750)

EC2の最小構成だったし, なるほどって感じ.

スワップファイルを作成すること対処方が提案されていたので,

[How To Add Swap on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04)

を参考に,

``` bash
$ sudo dd if=/dev/zero of=/swapfile bs=1G count=4
$ sudo fallocate -l 4G /swapfile
$ sudo chmod 600 /swapfile
$ sudo mkswap /swapfile
$ sudo swapon /swapfile
```

して再実行してみるとちゃんと対応できた！
