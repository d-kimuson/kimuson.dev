---
title: "Django開発環境をDocker+Pipenv上に作ろうとしたら詰まった"
description: "Django開発環境をDocker+Pipenv上に作ろうとしたら詰まった"
thumbnail: "/thumbnails/Python.png"
tags:
  - Python
  - Docker
category: "Django"
date: "2020-03-20T04:59:54+09:00"
weight: 5
draft: true
---

新規のプロダクトで, Django の開発環境を Docker コンテナに乗せて作っていたのだけど



パッケージ管理を Pipenv でしようとして色々詰まったのでメモしておく

## 開発環境を Docker に乗せる

チーム開発ってこともあって, Dev 環境は Docker ベースで作っておきたいなってことで乗せた.

パッケージ管理は,

- Pipfile がパッケージ取得時に自動更新される
- scripts に独自コマンドを定義できる

辺りが便利なので, Pipenv でやろうかなって思ったら結構詰まった

## 詰まった点

コンテナ内だから, わざわざ仮想化する必要もないかなって感じで最初は

``` Dockerfile
FROM python:3.7.6-stretch
WORKDIR /django_app
COPY ./Pipfile /django_app/Pipfile
COPY ./Pipfile.lock /django_app/Pipfile.lock
RUN python -m pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --dev --system
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

こんな感じで, パッケージを `/usr/local/bin/python` に直接インストールする形で構築した.

で, まあ問題なく動くんだけど, 問題点が2つあって

1つ目は, scripts が 仮想環境を見に行ってしまう点.

``` toml
...
[scripts]
wpython = "which python"
```

で,

``` bash
$ docker exec django_app pipenv run wpython
/django_app/.venv/bin/python
```

見ての通り.

2つ目が, `pipenv install <package>` において, システムのパッケージが更新されないこと

--systemオプションは, あくまで本番環境用のものなので, やっぱ開発環境での利用には向かないっぽい

と言った感じで, Pipenv を使ってる理由がほぼ潰れてしまった.

## てことで, コンテナ内で仮想環境を作ることに

Pipenv 自体が仮想環境と密結合になって価値を発揮しているので, 単純に仮想環境を使うほうが良さそう

と言っても面倒な点が多くて結構詰まった.

### 1. 仮想環境がマウントで壊れる

シンプルに思いつくのは,

**docker-compose.yml**

``` yml
version: "3.7"

services:
    django_app:
      ...
    volumes:
      - ./backend/django_api_server:/django_app
      - /django_app/.venv
    environment:
      PIPENV_VENV_IN_PROJECT: "true"
      ...
```

**django_app/Dockerfile**

``` Dockerfile
FROM python:3.7.6-stretch
WORKDIR /django_app
COPY ./Pipfile /django_app/Pipfile
COPY ./Pipfile.lock /django_app/Pipfile.lock
RUN python -m pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --dev
CMD ["/django_app/.venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
```

こんな感じだけど, 

1. イメージ構築 (Dockerfile の RUN) => コンテナ内に .venv が作成される
2. docker-compose.yml で指定したディレクトリのマウントが働く
    1. ホストOSの .venv がコンテナにマウントされる
    2. (マウントで, ホストOSの .venv でコンテナの .venv が上書きされる)
    3. コンテナ内の .venv をマウント対象から外す
    4. 結果として, .venv が空ディレクトリに
3. コンテナ構築

て感じで進んでしまうので,

マウント処理が完了しているコンテナ構築のタイミングでパッケージインストールなり, 

仮想環境を作る必要があるっぽい

てことで, CMD と ENTRYPOINT を併用してコンテナ構築時に作るようにする

参考: [[docker] CMD とENTRYPOINT の違いを試してみた](https://qiita.com/hihihiroro/items/d7ceaadc9340a4dbeb8f#%E4%BD%B5%E7%94%A8)

**Dockerfile**

``` Dockerfile
...
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["/django_app/.venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
```

**entrypoint.sh**

``` bash
#!/usr/bin/env bash

set -e
cmd="$@"

# 仮想環境構築
pipenv install --dev --ignore-pipfile  # Pipfile ではなく, Pipfile.lock から
source /django_app/.venv/bin/activate

# Django Dev Server の起動
python manage.py makemigrations && python manage.py migrate
exec $cmd  # cmd := /django_app/.venv/bin/python manage.py runserver 0.0.0.0:8000
```

これで, 仮想環境の python を実行環境として開発サーバーを起動できるようになった

## 2. コンテナ内でコマンド実行時に毎回仮想環境を呼ぶ必要がある

コンテナ内で作業するときは, 

``` bash
$ docker exec -it django_app bash
```

をしているのだけど, パッケージが仮想環境にインストールされているので,

``` bash
$ docker exec -it django_app bash
root@xxx:/django_app# python manage.py check
Traceback (most recent call last):
  File "manage.py", line 8, in main
    from django.core.management import execute_from_command_line
ModuleNotFoundError: No module named 'django'

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "manage.py", line 19, in <module>
    main()
  File "manage.py", line 14, in main
    ) from exc
ImportError: Couldn't import Django. Are you sure it's installed and available on your PYTHONPATH environment variable? Did you forget to activate a virtual environment?
```

こんな風に, パッケージが見つからずエラーを吐かれてしまう

対策として, .bashrc から自動的に仮想環境をアクティベートするようにする

**/django_app/.bashrc**

``` bash
#!/bin/bash

if [ "`which python`" != "/django_app/.venv/bin/python" ]; then
    source /django_app/.venv/bin/activate
fi
```

**Dockerfile**

``` Dockerfile
RUN echo "source /django_app/.bashrc" >> /root/.bashrc
```

直接 /root/.bashrc を書き換えても良かったけど,

他にも .bashrc を扱いたい場面が出てくるかもしれないので, マウントしてるディレクトリを参照してもらったほうが柔軟でいいかなってことでこの形で

これで,

``` bash
$ docker exec -it django_app bash
(django_app) root@xxx:/django_app# python manage.py check
System check identified no issues (0 silenced).
```

仮想環境が自動アクティベートされて使いやすくなった

見通しが悪くなったので, 最後に
[リポジトリ](https://github.com/kaito1002/django_docker_pipenv)
に全体像を貼っておきます

これで終わります.

**追記**

詳細はよくわからないんだけど, この方法だと PyCharm の DockerCompose 先を実行環境にする機能が, 仮想環境の利用を想定してないらしくて, 上手く扱えなかった

なので, PyCharm を使いたい場合は,

- パッケージはシステムに直接インストールする
  - ふつうに requirements.txt で管理する
  - 別にPipenvを使ってもいいけど使う意味はたぶんない
- SSH接続で対応
  - コンテナにSSH接続できるようにして SSH Interpreter を使う

辺りが解決策になりそう.

今回はとりあえず, VS Codeでやろうかなって思ってるんでまたの機会に試してみます.
