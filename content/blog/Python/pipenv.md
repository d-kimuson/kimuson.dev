---
title: "Pipenv 使ってみる"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: "2020-01-24T17:53:49+09:00"
weight: 5
draft: true
---

pipenvを使ってみる

公式ドキュメント: [Pipenv: 人間のためのPython開発ワークフロー](https://pipenv-ja.readthedocs.io/ja/translate-ja/)

## 導入

``` bash
$ pip install pipenv
```

**~/.bash_profile** に以下を追加しておく.

``` bash
export PIPENV_VENV_IN_PROJECT=1
```

これで, 仮想環境がプロジェクト内に作られるようになった(デフォルトだとルート下に作られて紐付けがされるらしい).

## プロジェクトでの利用

pipenvから, モジュールをインストールするとPipfileとPipfile.lockが作られる.

``` bash
$ mkdir TestPipenv && cd TestPipenv && touch main.py  # プロジェクト作成
$ pipenv install requests  # 試しに requests を取得
$ tree .
.
├── Pipfile
├── Pipfile.lock
└── main.py

0 directories, 3 files
$ ls -a
.            ..           .venv        Pipfile      Pipfile.lock main.py
```

パッケージ情報が記述された Pipfileと, Pipfile.lock, .venv(仮想環境) が作られた.

pipenv下で実行するには, 2つやり方があるとのこと.

1つ目は, pyvenv run \<command\> で実行する.

``` bash 
$ python main.py
Traceback (most recent call last):
  File "main.py", line 1, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'
$ pipenv run python main.py
Your IP is X.X.X.X
```

うん, 実行できた.

2つ目が, 仮想環境のアクティベート. まあこっちが一般的だろう.

``` bash
$ pipenv shell
(TestPipenv)$ python main.py
Your IP is X.X.X.X
```

## 環境の再現

Pipfile から作りたい場合は, 

``` bash
$ pipenv install --dev
```

Pipfile.lock から作りたい場合は,

``` bash
$ pipenv sync --dev
```

バージョン違いで動かなくこともあるだろうし, 基本は後者がいいだろう.

これで, 環境が再現される.

ちなみに, 既存のプロジェクトが requirements.txt で管理されてる場合は, requirements.txt から作ることもできるとのこと.

## スクリプトを登録する

よく使うコマンドにエイリアスをつけられる.

例えば, Djangoならサーバー起動には python manage.py runserver を使うし, pytestでテストをするなら, py.testを入れておくといいだろう.

``` txt
[scripts]
start = "python manage.py runserver"
test = "py.test"
```

``` bash
$ pipenv run start  # pipenv run python manage.py runserver
```

requirements.txt の更新忘れとか, 開発用パッケージを分ける手段がなくてストレスだったのでかなり良さそう.

積極的に使っていきたい.