---
title: "Selenium Dockerコンテナで Django のテストを実行する"
thumbnail: "/thumbnails/くじら.png"
tags:
  - "Senenium"
  - "Python"
  - "Django"
  - "Docker"
category: "DevOps"
date: "2020-02-21T00:27:36+09:00"
weight: 5
draft: true
---

Selenium の Dockerコンテナと Python の Unittest をしてみます.

## 環境

``` bash
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.15.2
BuildVersion:	19C57

$ docker -v
Docker version 19.03.5, build 633a0ea

$ docker-compose -v
docker-compose version 1.25.2, build 698e2846
```

## 構成

ざっと構成を見ていきます.

### ディレクトリ構成

``` bash
$ tree .
.
├── django_app
│   ├── Dockerfile
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── config
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── db.sqlite3
│   ├── manage.py
│   └── templates
│       └── index.html
└── docker-compose.yml
```

### docker-compose.yml

``` yml
version: "3.7"

services:
  django_app:
    build: ./django_app
    container_name: django_app
    restart: always
    ports:
      - "8000:8000"
    volumes:
      - ./django_app:/django_app
      - /django_app/.venv
    environment:
      IS_PRODUCT: 'no'
  selenium:
    image: selenium/standalone-chrome-debug
    container_name: selenium
    ports:
      - 4444:4444
      - 5900:5900
```

django_appには, 一般的なDjangoのプロジェクトが入っていて, そのままコンテナ化します.

seleniumは公式のイメージをそのまま使えるので特に設定することはありません.
5900ポートは VNC用です.

この django_app コンテナ内から selenium を呼んでテストを行えるようにしてみます.

## allowed_hosts の設定

allowedhosts で弾かれてしまうので, 

**settings.py**

``` python
...
ALLOWED_HOSTS = [...]

if os.getenv("IS_PRODUCT") == "no":
    import socket
    ALLOWED_HOSTS.append(
        socket.gethostbyname(socket.gethostname())
    )
...
```

環境変数見て, 開発用 Docker コンテナのときだけ, allowed hosts にコンテナのIPを追加するようにします.

これで, ホストで弾かれることはなくなります. まあ dev のときは \* で全て通してもいいんでしょうけど.

参考: [python - Running django tests with selenium in docker - Stack Overflow](https://stackoverflow.com/questions/32408429/running-django-tests-with-selenium-in-docker)

## テストを書く

とりあえず, タイトルが"Index"で, Index Pageとだけ出力されるシンプルなページを作り, ルートに紐付けました.

このトップページのタイトルがIndexであることを検証するテストを書いてみます.

unittestについては, [unittest --- ユニットテストフレームワーク — Python 3.8.1 ドキュメント](https://docs.python.org/ja/3/library/unittest.html) を参考に.

``` python
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from unittest import TestCase, main
import os
import socket

base_url = 'http://{}:8000'.format(
    socket.gethostbyname(socket.gethostname())
)


class SampleTest(TestCase):
    def setUp(self) -> None:
        self.browser = webdriver.Remote(
            command_executor='http://selenium:4444/wd/hub',
            desired_capabilities=DesiredCapabilities.CHROME
        )

    def tearDown(self) -> None:
        self.browser.quit()

    def test_user_story(self) -> None:
        # ユーザーがトップページにアクセスする
        self.browser.get(base_url + "/")

        # ページタイトルが Index であることを確認する
        self.assertEqual(
            'Index',
            self.browser.title,
            msg="Title is '{}'".format(self.browser.title)
        )


if __name__ == '__main__':
    main(warnings='ignore')
```

参考: [Djangoでのテスト駆動開発(1) - Qiita](https://qiita.com/ogihara/items/2a9241e377ce0f232737)

``` python
socket.gethostbyname(socket.gethostname())
```

から, django_app コンテナのIPアドレスを取得し, seleniumのブラウザからアクセスしてテストを実行しています.

``` bash
$ docker exec django_app python app/tests.py
.
----------------------------------------------------------------------
Ran 1 test in 0.674s

OK
```

テストも通ってます.

タイトルを変更してみると,

``` bash
$ docker exec django_app python app/tests.py
F
======================================================================
FAIL: test_user_story (__main__.SampleTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "app/tests.py", line 30, in test_user_story
    msg="Title is '{}'".format(self.browser.title)
AssertionError: 'Index' != 'Index2'
- Index
?      -
+ Index
 : Title is 'Index2'

----------------------------------------------------------------------
Ran 1 test in 0.558s

FAILED (failures=1)
```

失敗しますね.

とりあえず良さそうです.

ブラウザの内容が確認したい場合は, 

``` bash
$ open vnc://localhost:5900
```

して, secret をパスワードとして入力すれば画面がブラウザの動作する様子も確認できます.

すぐ閉じてしまうので, じっくりみたければ SampleTest.tearDown の中身をコメントアウトするといいかもしれません.

参考: [Dockerのselenium/standalone-chrome-debugコンテナにVNC接続する - Qiita](https://qiita.com/cacarrot/items/d3165056e50850fafef9)
