---
title: "Webhookを受け取って自動でデプロイする"
thumbnail: "/thumbnails/くじら.png"
tags:
  - "Python"
  - "Docker"
category: "DevOps"
date: "2019-09-08T13:13:22+09:00"
weight: 5
draft: true
---

## やりたいこと

GitflowしたりCIツール使うにあたって, せっかくだからデプロイを自動化したい

Circle CIやGithub Actions固有の機能としてもあるみたいけど, 

せっかくだから汎用性高くWebhookを受け取って自動デプロイをできるようにしたい

## 大まかな流れ

想定しているフローは,

1. リポジトリの更新等何らかのアクション
2. Webhookが送信される(CI or Github Webhook等)
3. サーバーがリクエストを受け取る
4. デプロイ用スクリプトを走らせる

と言った感じ.

## Webhookの受信方法について

Webhookの受信はたぶん以下のどっちかでやればいい

- アプリケーションサーバーを流用する(Webhook用にルーティングを設定する)
- Webhook受信用のサーバーを建てる

ただ, Dockerコンテナでサーバーを建ててるとホストOSにアクセスができない(=
デプロイ用スクリプトが実行できない)ので, 

Webhook受信用のサーバーを建てるしか無い(と思う).

てことで今回はアプリ側をDockerで建てたいので後者の方法でやってみる.

具体的な流れは,

1. 外部からHOST:80/webhookにリクエストを送信(Webhook)
2. Nginx(コンテナ)がHOST:20000(なんでもいい)に繋ぐ
3. Webhook受信用サーバーがデプロイスクリプトを走らせる

という流れ.

Webアプリ本体は以前Dockerで組んだお試しアプリがあるのでそれを流用する.

## Webhookを受け取るサーバーを建てる

せっかくdockerで環境構築が容易になってるのに, OSに直で複雑なフレームワークとかいれたくないからUbuntuに標準で導入されているPython3と, その標準ライブラリだけで建てる.

**webhook.py**

``` python
#!/usr/bin/python3
from wsgiref.simple_server import make_server
import subprocess
import json
import threading


def deploy():  # deploy用
  subprocess.call(['bash', 'deploy.sh'])
 

def webhook(environ, start_response):
  print("Deploy!")
  status = '200 OK'
  headers = [
    ('Content-type', 'application/json; charset=utf-8'),
    ('Access-Control-Allow-Origin', '*'),
  ]
  
  start_response(status, headers)
  # レスポンスが遅れてしまうのでスレッドを分ける
  deploy_thread = threading.Thread(target=deploy)
  deploy_thread.start()
 
  return [json.dumps({}).encode("utf-8")]


httpd = make_server('', 20000, webhook)
print("Serving on port 20000...")
httpd.serve_forever()
```

これで, サーバーが建っている間に

http:\[HOST]:20000にリクエストを送ればデプロイのスクリプト(deploy.sh)が走るようになった.




## デプロイするアプリケーション

nginxとdockerについて.

### nginx.conf

``` conf
server {
    listen 80;

    location / {
        include uwsgi_params;
        uwsgi_pass django_app:8080;
    }
    location /static {
        alias /static;
    }
    location /webhook {
        proxy_pass http://host.docker.internal:20000/;
        proxy_redirect off;
    }
}
```

### docker-compose.yml

``` yml
version: "3.7"

services:
  django_app:
    build: ./django-proj
    container_name: django_app
    restart: always
    expose:
      - 8080

  nginx:
    build: ./nginx
    container_name: nginx
    restart: always
    ports:
      - "80:80"
    extra_hosts:
    - "host.docker.internal:[HOST]"
```

\[HOST]にはデプロイ先のIPアドレスを入れておく.

Mac環境だと, host.docker.internalがデフォルトで提供されているので特に設定をしなくてもコンテナからホストのOSにアクセスできる.

ただLinux環境だと提供されないので

- extra_hostsから自分で設定する
- AWSコンソールのセキュリティグループの20000ポートへのアクセスを許可をする

をしないといけない(ここで結構時間持ってかれた)



## デプロイ用スクリプトの用意

デプロイ用のスクリプトでは,

- リポジトリの更新
- Dockerコンテナの停止・再構築・起動
- その他の必要な処理

等をする.

**deploy.sh**

``` bash
sudo docker-compose down
git fetch && git reset --hard origin/master
sudo docker-compose build
sudo docker-compose up -d
```

これで実際に, サーバーを建ててデプロイして, 外部から

``` bash
$ curl -X POST http://[HOST]/webhook
```

を叩くとデプロイされた！！



## webhook.pyのデーモン化

最後にwebhook.pyをデーモン化すれば終わり.

``` bash
$ sudo chmod 0755 webhook.py
$ sudo nano /etc/systemd/system/webhook.service
```

``` service
[Unit]
Description = Webhook server

[Service]
ExecStart = /usr/bin/python3 /path/to/webhook.py
Restart = always
Type = simple

[Install]
WantedBy = multi-user.target
```

``` bash
$ sudo systemctl enable webhook
$ sudo systemctl start webhook
$ sudo systemctl status webhook  # 確認
```

以上で, 一通り実装できた.

あとは, CIツールに

``` bash
$ curl -X POST http://[HOST]/webhook
```

を仕込むなり, Github WebhookにこのURLを設定するなりすれば自動デプロイが実現できる.

ただ, URL叩くとデプロイが起こせてしまうのは望ましくないので,

- ファイヤウォール等でブロック
- キー的なものをパラメータとして送信させる

等の対策はすべき.
