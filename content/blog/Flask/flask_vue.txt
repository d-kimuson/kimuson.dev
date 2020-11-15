---
title: "Flask + Vueで作成したWebアプリをAWSにデプロイする"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Flask"
  - "Vue.js"
  - "AWS"
category: "Flask"
date: 2019-08-25T00:03:08+09:00
weight: 5
draft: true
---

先日、インターンでWebアプリ開発をしてきました.

EC2とNginx, Uwsgiでアプリをデプロイしたりしたので, 復習とあとVueとの連携についても調べつつ, 備忘録としてまとめていきま.

構成としては,

- フロントエンドをVue.jsでSPAを構築
- バックエンドはflaskでRest APIを提供し, 見た目には一切関与しない
- サーバーに, AWSのEC2からUbuntuサーバーを利用する
- WebサーバーとしてNginx, アプリケーションサーバーとしてUwsgiを使用する
- データベースはとりあえず用いない

## content

- [content](#content)
- [準備](#準備)
- [vue.config.js](#vueconfigjs)
- [server.py](#serverpy)
- [Flask_RESTFul](#flask_restful)
- [AWSのEC2でUbuntuサーバーを建てる](#awsのec2でubuntuサーバーを建てる)
- [Nginx](#nginx)
- [uWSGI](#uwsgi)
- [その他](#その他)



## 準備

まずは, ディレクトリ構造を作っていく.

ただし,

- Pythonの環境は構築済み
- Vue CLIはバージョン3

を前提とする

``` bash
$ mkdir Project
$ cd Project
$ vue create frontend
$ mkdir backend
$ touch backend/server.py
$ python -m venv env
$ env/bin/activate
(env)$ pip install flask_cors
(env)$ tree . -L 2
.
├── env
│   ├── bin
│   ├── include
│   ├── lib
│   └── pyvenv.cfg
├── backend
│   └── server.py
└── frontend
    ├── README.md
    ├── babel.config.js
    ├── node_modules
    ├── package.json
    ├── public
    ├── src
    └── yarn.lock
```

これで一通りのディレクトリ構成は完成.



## vue.config.js

まず, vueで作成したSPAの吐き出し先を変更する.

諸々の設定は **vue.config.js** に書いていくので,

``` bash
$ touch frontend/vue.config.js
```

でファイルを作成して,

``` javascript
module.exports = {
    assetsDir: 'static',
    devServer: {
        proxy: 'http://localhost:5000'
    }
}
```

としておく.

これで, dist直下のstaticフォルダにcssやjavascriptソースが置かれるようになった.

``` bash
$ cd frontend
$ yarn run build
$ tree dist
dist
├── favicon.ico
├── index.html
└── static
    ├── css
    ├── img
    └── js
```



## server.py

基本的には, 見た目部分や画面遷移はVueで行い, flaskではバックエンド開発を行うことになるので,

Flask側では,

- index.htmlへのルーティング
- api開発

をすることになる.

``` python
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__,
            static_folder="path/to/frontend/static",
            template_folder="path/to/frontend")
CORS(app)
app.config['JSON_AS_ASCII'] = False  # 日本語
debug = True
host = '127.0.0.1'
port = 5000
threaded = True  # アクセスの同時処理


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=debug,
            host=host,
            port=port,
            threaded=threaded)
```

やってることは,

- リクエストを全部キャッチしてfrontend/dist/index.htmlに飛ばす
- CORSの許可([参考](https://qiita.com/mitch0807/items/cd18e8fc15bb12416f3d))

あとは, jsonを返すapi開発をしていけば良い.

**例**

``` python
@app.route('/api/test/')
def api_test():
    _ = {
        'hoge': 10
    }
    return make_response(jsonify(_))
```

この時点で,

- http://localhost:5000/ -> Vue Appの初期ページ
- http://localhost:5000/api/test -> {hoge: 10}のjson

が返されるようになった.



## Flask_RESTFul

一応, 前項のapi_test()のようにしてもRESTfulなAPIは作れるけど, flask_restfulを用いることでapiのファイルを切り離し, より本格的にapi開発ができる.

flask_restfulでのAPI作成と, js側との連携については

- [flaskで作成したrest apiとaxiosの連携について](/post/flask_axios)
- [axiosでファイルをPOSTし, flaskで受け取る](/post/flask_restful_file)

に書いたのでそちらを参照.



## AWSのEC2でUbuntuサーバーを建てる

インスタンスを通常通り作成していきます.

設定としては, 外部からアクセスできるようにセキュリティグループとして, httpプロトコルによるアクセスを許可することくらい.

データベースを同サーバーで起動し外部アクセスする場合(flaskで利用するだけならlocalhostでアクセスできるけど, 他の接続をしたければセキュリティを開放しておく必要あり.)は,

[UbuntuでMySQLを起動する](/post/ubuntu_mysql)

を参照.

あとは流れに沿って作成して接続する.

初めての接続ならキーペアを作成しておき, ダウンロード先のディレクトリに移動してから接続Command(インスタンスページの接続から表示できる)をコピペする.

初期設定としては,

``` bash
$ sudo apt-get -y update && sudo apt-get -y upgrade
$ sudo apt install -y git gcc make openssl libssl-dev libbz2-dev libreadline-dev libsqlite3-dev zlib1g-dev libffi-dev nginx
$ git clone https://github.com/yyuu/pyenv.git ~/.pyenv
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> .bash_profile
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> .bash_profile
$ echo 'eval "$(pyenv init -)"' >> .bash_profile
$ source .bash_profile
$ pyenv install 3.7.2
$ pyenv global 3.7.2
$ pip install --upgrade pip
$ python -m venv env
$ source env/bin/activate
```

この辺をやりました.

あとはgit clone等でローカルで開発したアプリケーションを共有すればOK.



## Nginx

※ここからはサーバー側の処理

Nginxを動かしていきます.

設定ファイルを書きます(Cent OSとかだと設定ファイルを置く位置が違うらしいから注意).

``` bash
(env)$ sudo rm /etc/nginx/sites-available/default
(env)$ sudo rm /etc/nginx/sites-enabled/default
(env)$ sudo nano /etc/nginx/sites-available/flask_app
```

~~こういうときvim使えたらかっこいいんだろうなぁ...~~

```
server {
    listen 80;
    server_name localhost;

    location / {
        include uwsgi_params;
        uwsgi_pass unix:///home/ubuntu/<reponame>/backend/APServer/app.sock;
    }
}
```

- ブラウザでパブリックDNSにアクセスすると勝手にport80を読みに行くので, listen 80を指定しておく.
- 次の項で, uWSGIのソケット位置を指定するのでここが一致するようにuwsgi_passも設定.

``` bash
(env)$ sudo ln -s /etc/nginx/sites-available/flask_app /etc/nginx/sites-enabled/flask_app
(env)$ sudo systemctl restart nginx.service
```



## uWSGI

アプリケーションサーバーとして, uWSGIを使う.

``` bash
(env)$ pip install uwsgi
```

- flask applicationの位置が, server.pyのapp
- socketとして<Project>/APPServer/app.socketを指定
- logファイルパスとして<Project>/APPServer/app.log

辺りを書いた, **test.ini** を用意して

``` ini
[uwsgi]
module = server:app

processes = 4
threads = 2

max-requests = 1000
max-requests-delta = 100
master = true

; socket
socket = ./APServer/app.sock
chmod-socket = 666

; LOG
logto = ./APServer/app.log
pidfile = ./APServer/app.pid

vacuum = true
die-on-term = true
```

``` bash
(env)$ uwsgi --ini test.ini
```

で起動.

AWSのパブリックDNSからアクセスが可能にいなっているはず.

止めるときはCtrl-C

ただこれでは接続してるときしか起動できないのでデーモン化用のiniファイルも用意しておく.

**demon.ini**

``` ini
[uwsgi]
module = server:app

processes = 4
threads = 2

max-requests = 1000
max-requests-delta = 100
master = true

; socket
socket = ./APServer/app.sock
chmod-socket = 666

; LOG
daemonize = ./APServer/app.log
log-reopen = true
log-maxsize = 8000000
logfile-chown = on
logfile-chmod = 644
pidfile = ./APServer/app.pid

vacuum = true
die-on-term = true
```

で, 起動する

``` bash
(env)$ uwsgi --ini demon.ini
```

stopするには,

``` bash
(env)$ uwsgi --stop APServer/app.pid
```

をすればOK.



## その他

一応, 今回のディレクトリ構成は
[リポジトリ](https://github.com/kaito1002/sample-flask-ec2)
にあるやつで, 

実際にデプロイしたサイトは
[ここ](http://ec2-3-15-176-213.us-east-2.compute.amazonaws.com/)
に置いてある(ただいつ止めるかは不明.)