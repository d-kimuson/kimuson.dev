---
title: "django applicationをHerokuにデプロイする"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Django"
  - "Heroku"
category: "Django"
date: "2020-01-09T15:53:48+09:00"
weight: 5
draft: true
---

どこか無料で建てられるサーバーないかな〜って思ってたら, そういえばHerokuあるやんてことで

## Setup

``` bash
$ heroku login
$ heroku create app-name
$ heroku addons:create heroku-postgresql:hobby-dev -a app-name
$ git init
$ heroku git:remote -a django-kaito-app
$ heroku buildpacks:set heroku/python
$ heroku config:set DISABLE_COLLECTSTATIC=1  # 必要に応じて
```

app-nameはグローバルな名前空間だから抽象的なのは被る

CSSとかの静的ファイルを扱いたければWebサーバー側をいじれないのでdjangoからホスティングしてあげるしかないはず.

そんときは, collectstatic機能使ってやるけど, 使わないときはエラー吐かれちゃうので今回は無効にしておく.

## 環境変数の設定

``` bash
$ heroku config:set ON_HEROKU=yes
```

必要な環境変数を, herokuコマンドから設置しておく.

通常の環境変数と同様に使える(os.getenvとかで引っ張ってこれる)

デフォルトでデータベースのURLが入っていた.

## サーバー起動用の Procfile, uwsgi.ini を設置

### Procfile

``` txt
web: uwsgi uwsgi.ini
```

### uwsgi.ini

``` ini
[uwsgi]
module = config.wsgi
master = true
processes = 4

; socket
http-socket = :$(PORT)
chmod-socket = 666

memory-report = true
die-on-term = true
```

あと requirements.txt も必要なので, 通常通り設置する

とりあえず,

- uwsgi
- dj_database_url
- psycopg2

uWSGI用と, postgreSQL接続用にこの辺が必要だった.

## ALLOWED_HOSTS の 設定

めんどければとりあえず "*" で全部許可しても一応動くけど,

``` python
ALLOWED_HOSTS = [
    "アプリ名.herokuapp.com"
]
```

しておく.

## データベースの設定

常に本番環境のデータベースを使ってもいいが,  Heroku postgreSQLは無料枠が制限されてるので極力使いたくないなってことで, ローカルではsqliteの方使って, 本番環境でのみそっちのDB使うことにした.

**settings.py**

``` python
import os
import dj_database_url

ON_HEROKU = os.getenv('ON_HEROKU') == 'yes'
DATABASE_URL = os.getenv('DATABASE_URL')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

if ON_HEROKU:
    db_from_env = dj_database_url.config(default=DATABASE_URL, conn_max_age=400)
    DATABASES['default'].update(db_from_env)
    DEBUG = False
```

環境変数からデータベースURLもらってきて, Heroku上でのみpostgreSQLを使うようになった.

おまけにHeroku上では, debugモードを解除するようにしておく.

## マイグレーション

heroku run に続けてコマンドを打つと, デプロイ先でコードを走らせてくれるので, djangoのmanage.pyから呼ぶコマンドを本番環境でも使うことができる.

ただなぜか, むこうでやっても上手く行かなかったのでローカルからやることにした.

``` bash
$ python manage.py makemigrations && python mange.py migrate
```

---

この変でだいたい設定が終わったのでデプロイする

``` bash
$ git add . && git commit -m "initiali commit" && git push heroku master
$ heroku open
```

これで画面にデプロイしたサイトが表示されれば成功, なにか問題が起きたらエラーメッセージか

``` bash
$ heroku logs --tail
```

でログみて対処する.