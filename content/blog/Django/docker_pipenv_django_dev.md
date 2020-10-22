---
title: "Djangoの開発環境をDockerに乗せてPipenvでパッケージ管理しようとしたら詰まって結局やめた話"
description: "Djangoの開発環境をDockerに乗せた状態で、Pipenvでパッケージ管理しようとしたら詰まって結局やめた話をします。"
thumbnail: "/thumbnails/Python.png"
tags:
  - Python
  - Pipenv
  - Docker
category: "Django"
date: "2020-03-20T04:59:54+09:00"
draft: false
---

友人と企画したサービスの開発で [Django](https://github.com/django/django) の開発環境を `Docker` コンテナに乗せて作っていたのだけど, パッケージ管理を [Pipenv](https://pipenv-ja.readthedocs.io/ja/translate-ja/basics.html) でしようとして色々詰まって結局やめたのでメモしておく.

## Pipenv を使おうとした理由

チーム開発だったので環境間の差分を吸収したかったのと, 個人的にキャッチアップしたかったという理由で開発環境は `Docker` の上に構築した.

パッケージ管理は,

- Pipfile がパッケージ取得時に自動更新される
  - `pip install <package>` だと `requirements.txt` の更新漏れがあるし, そもそもめんどい
- scripts に独自コマンドを定義できる
- 開発用パッケージ(autopep8, mypyとか)を分けて管理できる

辺りが便利なので, Pipenv でやろうかなって思ったら結構詰まった

## まずは詰まった点

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

1つ目は, scripts が仮想環境を見に行ってしまう点.

``` bash
$ docker exec django_app pipenv run which python
/django_app/.venv/bin/python
```

見ての通り.

2つ目が, `pipenv install <package>` において, システムのパッケージが更新されないこと

--systemオプションは, あくまで本番環境用のものなので, やっぱ開発環境での利用には向かないっぽい

と言った感じで, Pipenv を使ってる理由がほぼ潰れてしまった.

## てことで, コンテナ内で仮想環境を作ることに

Pipenv 自体が仮想環境と密に結合しているパッケージマネージャなので, 単純にコンテナ内のランタイムも仮想環境を使うほうが良さそう

と言っても面倒な点が多くてまたまた詰まる

### 1. 仮想環境がマウントで壊れる

シンプルに思いつくのは,

``` yml:title=docker-compose.yml
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

``` Dockerfile:title=django_app/Dockerfile
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

マウント処理が完了している **コンテナ構築のタイミングで** パッケージインストールなり, 仮想環境を作る必要があるっぽい

てことで, CMD と ENTRYPOINT を併用してコンテナ構築時に作る

参考: [[docker] CMD とENTRYPOINT の違いを試してみた](https://qiita.com/hihihiroro/items/d7ceaadc9340a4dbeb8f#%E4%BD%B5%E7%94%A8)

``` Dockerfile:title=Dockerfile
...
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["/django_app/.venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
```

``` bash:title=entrypoint.sh
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

### 2. コンテナ内でコマンド実行時に毎回仮想環境を呼ぶ必要がある

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

``` bash:title=/django_app/.bashrc
#!/bin/bash

if [ "`which python`" != "/django_app/.venv/bin/python" ]; then
    source /django_app/.venv/bin/activate
fi
```

``` Dockerfile:title="/django_app/Dockerfile"
RUN echo "source /django_app/.bashrc" >> /root/.bashrc
```

これで,

``` bash
$ docker exec -it django_app bash
(django_app) root@xxx:/django_app# python manage.py check
System check identified no issues (0 silenced).
```

問題が解消された.

見通しが悪くなったので,
[d-kimuson/django_docker_pipenv](https://github.com/d-kimuson/django_docker_pipenv)
に全体像を貼っておきます

---

以下追記です。

## PyCharmがパッケージを読んでくれない

詳細はよくわからないんだけど, この方法だと PyCharm の `docker-compose` のコンテナを実行環境にする機能が, 仮想環境の利用を想定してないらしくて, 上手く扱えなかった

対策のしようもなさそうなので、結局 Pipenv の採用をやめて pip を使うことにした.

- Pipfile がパッケージ取得時に自動更新される
- scripts に独自コマンドを定義できる
- 開発用パッケージ(autopep8, mypyとか)を分けて管理できる

の3つを `Pipenv` の利点としてあげたけど, この辺はパッケージのインストール/アンインストール用の `bash` 関数を用意して, 上記と同様に `.bashrc` で自動適用することで再現した

詳細は書かない(別記事では書くかも)けど,

インストール・アンインストール用の独自関数で

1. パッケージを普通に更新しつつ,
2. `dev` / `production` 用の `requirements.txt` を更新する

て形にした.

他にも `Pipenv` の `scripts` に書きたいようなものは `.bashrc` に書く形にで落ち着いた

僕の中では, Pipenvは便利だけど, Dockerコンテナを使わないときだけ使うかなーという結論になりました
