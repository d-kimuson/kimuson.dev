---
title: "Ubuntu(EC2)でMySQLを起動する"
thumbnail: "/thumbnails/データベース.png"
tags:
  - "MySQL"
  - "データベース"
category: "MySQL"
date: "2019-08-22T08:29:58+09:00"
weight: 5
draft: true
---

EC2のUbuntu OSにMySQLを導入して, 外部からアクセスできるようにする流れのメモ.

## 導入と起動

``` bash
$ sudo apt install -y mysql-server mysql-client
$ sudo service mysql status
$ sudo service mysql start
```

初期のubuntuだと色々揃ってないので, なにか足りないと言われたらその都度aptかapt-getから導入する.

## データベースに接続

``` bash
$ sudo mysql -u root -p
```

ルートユーザで接続.



##  接続用ユーザーの作成

rootでアクセスし続けるのはあれなので, 接続用ユーザーを作成してall権限を付与しておく.

``` bash
mysql> create user sampleuser identified by 'passwd';
mysql> grant all privileges on *.* to sampleuser;
mysql> flush privileges;
```




## ユーザーを外部アクセス可能に変更


### 1. ubuntu側での設定

``` bash
$ sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

bind_addressをコメントアウトする

### 2. awsコンソールから側の設定

セキュリティグループから,

- インバウンド: MySQL + 任意の場所
- アウトバウンド: MySQL

のルールを追加し, MySQLを再起動

``` bash
$ sudo service mysql restart
```

外部から,

``` bash
$ mysql -h [IPアドレス] -u sampleuser -p
```

で接続できる(IPアドレスはAWSコンソールより確認).
