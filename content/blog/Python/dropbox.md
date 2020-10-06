---
title: "PythonからAPIを利用してDropboxを操作する"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Dropbox"
category: "Python"
date: "2019-05-18T20:45:15+09:00"
draft: true
weight: 5
---

Herokuでdiscordbotを作ってたんですが, 静的ファイルが時間で消えてしまうみたいで, どこか置いておける場所が欲しくてDropbox APIを触ってみたので基本操作を備忘録ついでにまとめておきます．

## 事前準備(必要な環境の整備，アカウント登録など)

- [Python 3.6.2](https://www.python.org/downloads/)
- dropbox (パッケージ)
- dropbox のアクセストークン

dropboxパッケージに関しては pipでインストール．

``` bash
$ pip install dropbox
```

### アクセストークンの取得

1. [Dropboxの開発者ページ](https://www.dropbox.com/lp/developers)
にアクセスして，Create Appsからアプリを作成.
2. Dropbox API，App folderを選択し, App名を決めて作成.
3. Generate access tokenからアクセストークンを取得.

### 接続用コード

Dropboxに接続するための最小限のコード.

``` python
import dropbox

TOKEN = "アクセストークンをここに入力"

dbx = dropbox.Dropbox(TOKEN)
dbx.users_get_current_account()
```



## ファイルのアップロード

``` python
PATH_LOCAL = "アップロードしたいファイルパス"
PATH_DBX = "アップロード先のファイルパス(Dropbox上)"

with open(UPLOADPATH_LOCAL, "rb") as f:
    dbx.files_upload(f.read(), UPLOADPATH_DBX)
```

## ファイルのダウンロード

``` python
PATH_LOCAL = "ダウンロード先のファイルパス"
PATH_DBX = "ダウンロード元のファイルパス(Dropbox上)"

dbx.files_download_to_file(PATH_LOCAL, PATH_DBX)
```

## ファイルの一括ダウンロード

``` python
PATH_FROM = "ダウンロード元のフォルダパス(Dropbox上)"
PATH_TO = "ダウンロード先のフォルダパス"

for entry in dbx.files_list_folder(PATH_DBX).entries:
    dbx.files_download_to_file(PATH_LOCAL + entry.name, PATH_DBX + entry.name)
```

## Dropbox内のファイルを削除

``` python
PATH_DBX = "削除するファイルパス"

dbx.files_delete(PATH_DBX)
```

## Dropbox内のファイルを全削除

``` python
PATH_DBX = "削除するフォルダパス(Dropbox上)"

for entry in dbx.files_list_folder(PATH_DBX).entries:
    dbx.files_delete(PATH_DBX + entry.name)
```

以上.
