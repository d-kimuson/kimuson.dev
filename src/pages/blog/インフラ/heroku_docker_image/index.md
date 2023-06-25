---
title: "Heroku に SPA on Django の Docker イメージをデプロイする"
description: "Heroku に Docker イメージをデプロイしたので簡単にメモを残します"
category: "インフラ"
tags:
  - Heroku
  - Docker
date: "2020-11-29T13:48:15Z"
thumbnail: "thumbnails/Heroku.png"
draft: false
---

## TL;DR

- Heroku に Docker イメージをデプロイします
- SPA を同一オリジンで Django から配信するアーキテクチャです
- Docker 関連以外の話はしません (静的ファイル配信、DB 等)

## Heroku には Docker イメージもデプロイできる

Heroku といえば、Git からデプロイのイメージが強かったんですが、Docker イメージでのデプロイにも対応しているらしいです

[Deploying with Docker \| Heroku Dev Center](https://devcenter.heroku.com/categories/deploying-with-docker)

によると、

- 手元で Docker イメージをビルドして、Heroku に投げる
- `heroku.yml` を使って、リポジトリからイメージをビルドする

の 2 つがあります

この記事では、前者を使いますが、CI/CD を絡ませるなら、手元でビルドするのではなく `heroku.yml` にしたがって Heroku 上でビルドできるので後者のが良さそうな印象でした

どちらも単一のイメージから建てるものですが、Heroku にはもともと Heroku Postgres があり、Docker イメージならマルチステージビルドも行えるので

- フロント: SPA / SSG
- バック: API サーバー
- RDB: Heroku Postgres

みたいなアーキテクチャなら対応できます

逆に、API サーバーも建てるけどフロントでは SSR したいとかは無理なはずなので、別の形を考える必要があると思います

## SPA on Django のイメージを作る

Heroku では、

[Using Multiple Buildpacks for an App | Heroku Dev Center](https://devcenter.heroku.com/articles/using-multiple-buildpacks-for-an-app)

辺りを使うことで、
ビルドに Node.js と Python を使う、みたいなことはできるんですが、

プロジェクトルートからデーモン用のビルドパックを自動認識するので

- Django Project (`Python Runtime`)
  - ...
  - frontend (`Node Runtime`)
    - ...

みたいなディレクトリ構成じゃないと(たぶん)ダメです

Docker のビルドならこの辺の縛りがないのでとても良きです

とりえあず

- backend (`Django Application`)
- frontend (`Node Application`)
- ...

みたいなディレクトリ構成ということにします

```Dockerfile
# Build Frontend Staticfiles
FROM node:14.15.1-stretch as front-build

WORKDIR /frontend
COPY ./frontend /frontend

RUN yarn install
RUN yarn build  # frontend/dist にビルドされる

# Build Backend Django Packages
FROM python:3.8.6-buster
WORKDIR /backend

COPY ./backend /backend
COPY --from=front-build /frontend/dist /frontend/dist

RUN pip install --no-cache-dir -q -r requirements.txt

CMD gunicorn config.wsgi:application --bind 0.0.0.0:$PORT  # $PORTは実行時の環境変数から取得される
```

こんな感じでマルチステージビルドを使って、イメージが構築されます

## CMD と ENTRYPOINT について

`$ heroku run` のときの環境で Dockerfile の各値が使われます

- `WORKDIR`: カレントディレクトリ
- `ENV`: 環境変数
- `ENTRYPOINT`: `$ heroku run <cmd>` → `$ <ENTRYPOINT> <cmd>`

てな感じ。

Docker-Compose のくせで、

```Dockerfile
# ...
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:$PORT" ]
```

こんな感じで `entrypoint.sh` を `ENTRYPOINT` に指定して、`CMD` を渡したんですけど、毎回 `entrypoint.sh` が呼ばれてしまって `$ heroku run` がまともに使えませんでした

なので、`ENTRYPOINT` は指定せずに

```Dockerfile
# ...
CMD [ "./entrypoint.sh" ]
```

とする必要があります

起動前に走らせたいものがないなら、直接サーバーを起動しても良いですけど、配列型で指定すると変数が展開されないので注意が必要です

```Dockerfile
CMD [ "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:$PORT" ]  # NG
CMD gunicorn config.wsgi:application --bind 0.0.0.0:$PORT                 # OK
```

## デプロイする

`Heroku CLI` のセットアップとログイン、アプリ作成(`heroku create`)がされていることは前提として、

```bash
$ heroku container:push web
```

で、ローカルの `Dockerfile` を参照した Docker イメージのビルドが行われます

今回のやり方では、デプロイがリポジトリと連動しません

```bash
$ heroku container:release web
```

によって、ビルドされたイメージがリモートに送信され、デプロイされます

一連の流れとして、

```bash:deploy.sh
heroku container:push web

if [ $? = "0" ]; then
  heroku container:release web
  heroku logs -t
fi
```

辺りを定義しておくと良さそうでした

## 終わりに

以上です

実際にデプロイするには、

- Nginx 等を挟まないので、collectstatic して、whitenoise で配信する
- SPA のルーティング設定
- Heroku Postgres に環境変数から接続情報を取得して繋ぐ

とかとか、もろもろすることはありますが、その辺は主題じゃないので割愛しました

ステージング環境用に作ったんですが、結構良さそうだったので良ければぜひ。
