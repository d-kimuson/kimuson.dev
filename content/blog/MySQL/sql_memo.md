---
title: "MySQL 基本操作 メモ"
thumbnail: "/thumbnails/データベース.png"
tags:
  - "MySQL"
  - "データベース"
category: "MySQL"
date: "2020-01-01T15:10:09+09:00"
weight: 5
draft: true
---

## MySQLサーバーを建てる(osx, local)

``` bash
$ mysql.server start
```

## ルートで接続

``` bash
$ mysql -u root
```

## データベースと作業用ユーザーの作成

``` sql
-- drop database if exists sample_db;
create database sample_db;
create user user4sample_db identified by 'password';
grant all on sample_db.* to user4sample_db@localhost;
```

## 作業用ユーザーでデータベースに接続

``` bash
$ mysql -u user4sample_db -p sample_db
> password
```

## ユーザーを確認

``` bash
select user();
```

## データベースの選択

``` sql
use sample_db;
```

## 選択中のデータベースを確認

``` sql
select database();
```

## テーブルの新規作成(定義)

``` sql
create table table01 (
  id int unsigned primary key auto_increment,
  name varchar(20) unique,
  description varchar(255) default '',
  score float unsigned not null
)

-- テーブル定義の確認
desc table01;
```

## テーブル定義の変更

### テーブル名の変更

``` sql
alter table table01 rename table02;
```

### フィールドの追加

``` bash
alter table table01 add column is_delete boolean after name;
```

### フィールドの削除

``` bash
alter table table01 drop colummn score;
```

### フィールドの変更

``` bash
alter table table01 change column change name changed_name varchar(20) unique;
```

## レコードの抽出

**基本形**

``` sql
select カラムの羅列 from テーブル where 条件式
```

条件式には,

| 種類 | 例 |
| :---: | :---: |
| 比較演算子 | >=, >, =, != ...etc |
| 論理演算子 | and, or, not |
| 同値 | is |
| 含む | in (hoge, hoge2, hoge3) |

が使える

``` sql
select id, name from table01 where score > 30 and score < 80;
```

### 文字列の部分一致, 検索的な

``` bash
select id, name from table01 if name like = 't%';
```

| 記号 | 意味 |
| :---: | :---: |
| % | 0文字以上の任意の文字列 |
| _ | 任意の1文字 |

大文字, 小文字の区別あり => liken **binary** '%hoge%'

### レコードの並び替え

**order by** を使う

``` sql
select * from table01 if score is not null order by score;
-- select * from table01 if score is not null order by score desc;  descending: 降順
```

### 件数の限定

``` sql
select * from table01 limit3;           -- 1, 2, 3
select * from table01 limit3 offset 3;  -- 4, 5, 6
select * from table01 limit3 offset 6;  -- 7, 8, 9
```

## レコード操作

### 追加

``` sql
insert into table01 (name, score) values ('taro', 50);
```

### 更新

``` sql
update table01 set score = 60 where id = 1;
```

where句でレコードを選択して値を更新

### 削除

``` sql
delete from table01 where score < 30;
```