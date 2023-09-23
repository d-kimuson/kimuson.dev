---
title: "Django で Slack Bot を作る"
description: "Djangoで Slack Bot作ったので、簡単に手順をまとめておきます。"
thumbnail: "/thumbnails/Django.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2020-02-21T00:18:07+09:00"
weight: 5
draft: false
---

Django で Slack Bot 作ったので、簡単に手順をメモしておきます

## 環境

```bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.2
BuildVersion:   19C57

$ python -V
Python 3.7.2

$ pip -V
pip 20.0.2
```

## Django でプロジェクトを作る

```bash
$ pip install django django_rest_framework slackclient requests
```

この辺を使うので、インストールしておきます

プロジェクト作成は本筋と逸れるので割愛しますが、以下のような構成です

```bash
$ tree .
.
├── config
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── db.sqlite3
├── manage.py
├── requirements.txt
└── slack_app
     ├── __init__.py
     ├── admin.py
     ├── apps.py
     ├── models.py
     ├── templates
     │   └── slack
     │       └── index.html
     ├── tests.py
     ├── urls.py
     └── views.py
```

## ざっくりと流れ

フローとしては、

1. Slack にメッセージが送信される
2. 予め登録しておいたエンドポイントにリクエストが送られる
3. サーバー側でメッセージ送信用 API を呼ぶ

って感じで Bot を動かすことができます

## Slack App の作成と初期設定

https://api.slack.com/apps にアクセスして、Create New App から App を作成します

Client ID, Client Secret, `Verification Token` をコピって `config/settings.py` に記述しておきます

```python:config/settings.py

...
SLACK_CLIENT_ID = "コピったやつ"
SLACK_CLIENT_SECRET = "コピったやつ"
SLACK_VERIFICATION_TOKEN = "コピったやつ"
...
```

次に, **OAuth & Permissions** タブから, http://localhost:8000/slack/oauth/ を Redirect URL に追加しておきます

最後に, **App Home** タブから Review scoped to add => Scopes => bot token scopes と進み、適当にスコープを追加しておきます

とりあえず、Bot User を作るためなのでなんでも OK です

## Bot のワークスペース追加用ページの作成

以下のようにルーティングをします

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('slack/', include('slack_app.urls'))
]
```

```python:slack_app/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('oauth/', views.oauth, name='slack_oauth')
]
```

これで, `/slack/` に 追加ボタンを置いておいて, クリックされると `/slack/oauth/` がリダイレクトで呼ばれます(さっき上で登録しておいた)
request には, パラメータとして `code: 一時コード` が送られてくるので、これをそのまま使って認証してあげます

index.html と、view を書きます

```html
<!-- slack_app/templates/slack/index.html -->
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <h1>ワークスペースにBotを追加する</h1>
    <a
      href="https://slack.com/oauth/authorize?scope=bot&client_id={{ client_id }}"
    >
      Botを追加
    </a>
  </body>
</html>
```

```python:slack_app/views.py
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
import requests
import json

from config.settings import SLACK_CLIENT_ID, SLACK_CLIENT_SECRET


def index(request: HttpRequest) -> HttpResponse:
    context = {
        "client_id": SLACK_CLIENT_ID
    }
    return render(request, 'slack/index.html', context)


def oauth(request: HttpRequest) -> HttpResponse:
    """
    == Send Request ==
    requests.get(url, {
        "code": "xxx",
        "client_id": "xxx",
        "client_secret": "xxx"
    })

    == Response ==
    {
        'ok': True,
        'access_token':
        'xoxp-xxx',
        'scope': 'xxx, yyy',
        'user_id': 'xxx',
        'team_id': 'xxx',
        'enterprise_id': None,
        'team_name': 'xxx',
        'bot': {
            'bot_user_id': 'xxx',
            'bot_access_token': 'xxx'
        }
    }
    """
    response = json.loads(
        requests.get('https://slack.com/api/oauth.access', params={
            "code": request.GET.get('code'),
            "client_id": SLACK_CLIENT_ID,
            "client_secret": SLACK_CLIENT_SECRET
        }).text
    )

    if response['ok']:
        return HttpResponse('ボットがワークスペースに参加しました！')
    else:
        return HttpResponse('失敗しました！リトライしてね！')
```

これで, http://localhost:8000/slack/ => ボタンをクリック => 適当に進めると ボットがワークスペースに参加しました! と表示されるはずです。 わーい

ついでに, **OAuth & Permissions** タブに行くと、Bot Token が追加されているはずなので、こちらもコピってきて `config/settings.py` に書いておきます

```python:config/settings.py

...
SLACK_CLIENT_ID = "コピったやつ"
SLACK_CLIENT_SECRET = "コピったやつ"
SLACK_VERIFICATION_TOKEN = "コピったやつ"
SLACK_BOT_USER_TOKEN = "xoxb-hogehoge"
...
```

## メッセージ受信用 API の作成

チャンネルにメッセージが流れたときに呼ばれるエンドポイントを作っていきます.

```python:slack_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from slack import WebClient
from slack.errors import SlackApiError

from config.settings import SLACK_BOT_USER_TOKEN

client = WebClient(token=SLACK_BOT_USER_TOKEN)


class Events(APIView):

    def post(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        # トークン認証
        if request.data.get('token') != SLACK_VERIFICATION_TOKEN:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Endpoint 認証
        if request.data.get('type') == 'url_verification':
            return Response(
                data=request.data,
                status=status.HTTP_200_OK
            )

        # Botのメッセージは除外する
        if request.data['event'].get('bot_id') is not None:
            print("Skipped bot message ...")
            return Response(status=status.HTTP_200_OK)

        # ⇓ ロジック ⇓
        message_info = request.data.get('event')

        channel = message_info.get('channel')
        text = message_info.get('text')

        if 'hi' == text:
            try:
                client.chat_postMessage(
                    channel=channel,
                    text="hi"
                )
            except SlackApiError as e:
                print(e)
                return Response("Failed")

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_200_OK)
```

会話ロジックを書く前に

- トークン認証
- エンドポイント認証(事前に、slack に対してこのエンドポイントの認証をするのでその時用のもの)
- Bot からの送信をスキップする(例えばオウム返しロジックだと、Bot のメッセージにも反応して無限に呼ばれてしまう)

を書いて上げてから、ロジックの部分を書いてあげます

今回は、hi を受け取ったら hi を返すというシンプルなものです

view ができたので、ルーティングもつけてあげます

```python:slack_app/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('oauth/', views.oauth, name='slack_oauth'),
    path('events/', views.Events.as_view(), name='events')
]
```

一応これで完成ですが、slack からこの API を呼んであげないといけないので外部に公開する必要があります

デプロイするのも手ですが、[ngrok](https://ngrok.com/) というローカルのサーバーを外部に公開(というか繋いでくれる?)できる素晴らしいサービスがあるので、こちらを使います

```bash
$ brew cask install ngrok
$ ngrok http 8000
ngrok by @inconshreveable

Session Status                online
Session Expires               5 hours, 54 minutes
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://xxx.ngrok.io -> http://localhost:8000
Forwarding                    https://xxx.ngrok.io -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              54      0       0.00    0.00    0.72    92.44
```

あとは, Slack API 側から **Event Subscriptions** タブ => Redirect URL に https://xxx.ngrok.io/slack/events/ を追加してあげて、Verified! と表示されれば OK です

保存して、Slack のワークスペースからボットに hi と送ってあげると、ローカルのサーバーが反応します

ただまだスコープをちゃんと設定してないので、エラーが吐かれるはずです

```bash
The server responded with: {'ok': False, 'error': 'missing_scope', 'needed': 'chat:write:bot', 'provided': 'calls:read,channels:history'}
```

`chat:write` が必要だそうなので, **OAuth & Permissions** から chat:write を追加して再度試せば返事が帰ってきます

ずっと ngrok 動かしとくわけにもいかないので、お試しじゃなくてちゃんとやるなら VPS なり Heroku なりで本番環境を用意して同じように動きます
