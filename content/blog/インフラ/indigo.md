---
title: "WebARENA IndigoでVPSを建てる"

thumbnail: "/thumbnails/prog_g.png"
category: "インフラ"
date: "2020-02-05T22:03:04+09:00"
weight: 5
draft: true
---

[WebARENA](https://web.arena.ne.jp/) さんでVPSを建てたので, 簡単にやったことをメモして置きます.

## 環境

環境は以下のとおりです.

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.2
BuildVersion:   19C57
```

## SSHキーの作成

ssh接続用に, ローカルで indigo(秘密鍵), indigo.pub(公開鍵) を作成して置きます.

``` bash
$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/kaito/.ssh/id_rsa): indigo
```

## インスタンスの作成

[WebARENA indigo](https://web.arena.ne.jp/indigo/) から, サインインして [Indigo](https://indigo.arena.ne.jp/dashboard) から Ubuntu インスタンスを作成します.

接続用のSSHキーには, 先ほど作っておいた公開鍵の indigo.pub を渡してあげます.

## 接続

インスタンスが作成されてるので, IPアドレスをコピってローカルから接続してみます.

デフォルトのユーザーは, ubuntuだそう(centos verだと, centos).

``` bash
$ ssh ubuntu@xxx.xxx.xxx.xxx -i ~/.ssh/indigo
```

なんの問題もなく接続できました. わーい.

初回アクセスなので, apt と apt-get を更新しておきます.

``` bash
$ sudo apt-get upgrade && sudo apt-get update
$ sudo apt upgrade && sudo apt update
```

## SSH接続用ポートの変更

最低限のセキュリティ設定をしておきます.

SSH接続用ポートを22から任意のものに変更します.

とりあえず2222番てことで.

``` bash
$ sudo nano /etc/ssh/sshd_config
# #Port 22 => Port 2222
$ sudo systemctl restart sshd
```

sshdをリスタートすれば, 接続用ポートが変更されているので,

``` bash
$ ssh ubuntu@xxx.xxx.xxx.xxx -i ~/.ssh/indigo -p 22

ssh: connect to host xxx.xxx.xxx.xxx port 22: Connection refused
$ ssh ubuntu@140.227.122.185 -i ~/.ssh/indigo -p 2222

Welcome to Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-43-generic x86_64)
...
```

となり, SSH用ポート番号が変更されていることが確認できます.

indigo側から, ファイアウォールでインバウンドルールにカスタムTCPの 0.0.0.0:2222 を追加しておきます.

あとは, Root ログイン禁止とパスワード認証禁止辺りをしておこうと思ったんだけど,

デフォルトで,

- パスワード認証禁止
- ルートログインはパスワード認証のみ

になってたので, 問題なさそうです.
