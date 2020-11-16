---
title: "Django REST frameworkとVueで簡単なアプリを作ってみる"
description: "Django REST frameworkを触ってみます。Vueと組み合わせて簡単なアプリを作ってみました。"
thumbnail: "/thumbnails/Django.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2019-09-03T11:50:33+09:00"
weight: 5
draft: true
---

Flaskに色々加えて作るのばからしくなってきたので, そろそろ Django 触ってみます的な.

## 構成

とりあえず,

- フロントエンド: VueでSPA
- バックエンド: DjangoでREST API
- DB: SQLite3(django標準なので)

で作っていきます.

## Djangoでプロジェクト作成

よく

``` bash
$ django-admin startproject myproject
$ tree myproject
myproject
├── manage.py
└── myproject
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py

1 directory, 5 files
```

でのプロジェクト作成例が紹介されていて, 全体のディレクトリとプロジェクトディレクトリの名前が同じことに非常に強い違和感を覚えてたんですが, どうやら別のディレクトリ名にもできるらしいので今回はそうします.


``` bash
$ mkdir myproject && cd myproject
$ django-admin startproject config .
$ tree ../myproject
../myproject
├── config
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py

1 directory, 5 files
```

これでOK.

この階層に以下のディレクトリ構成を作成していきます.

- api: api開発
- vueapp: vueのSPA(django側)
- frontend: vueのSPA(Vue側)
- env: pythonのvenv

``` bash
$ python manage.py startapp api
$ python manage.py startapp vueapp
$ vue create frontend
# お試しなのでdefalut(babel, esline)構成で
$ python -m venv env && source env/bin/activate
(env)$ tree -L 2
.
├── api
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── config
│   ├── __init__.py
│   ├── __pycache__
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── env
│   ├── bin
│   ├── include
│   ├── lib
│   └── pyvenv.cfg
├── frontend
│   ├── README.md
│   ├── babel.config.js
│   ├── node_modules
│   ├── package.json
│   ├── public
│   ├── src
│   └── yarn.lock
├── manage.py
└── vueapp
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations
    ├── models.py
    ├── tests.py
    └── views.py

14 directories, 22 files
```

基本的な構成はできたので, それぞれを色々設定していきます.

Git管理化に起きたければこの辺でinitial commitしたくなるかもですが, vueのほうは勝手にgit管理しちゃってるので

``` bash
$ rm -rf frontend/.git
```

してからgit initする必要があります.


## Vue側の設定(frontend)

frontendディレクトリに展開したVueのアプリケーションを設定していきます.

基本的に, vueで作成したアプリケーションのbuildしたファイル群をdjangoで適切にルーティングさせて使っていくのでbuildさえすればOKなんですが,

デフォルトだとindex.htmlとstaticディレクトリがdistに展開されてしまうのでそこだけ修正していきます.

``` bash
(env)$ cd frontend
(env)$ touch vue.config.js  # 編集
```

**vue.config.js**

``` javascript
module.exports = {
  assetsDir: 'static'
}
```


これで, 吐き出し先の設定ができたのでbuildしていきます.

``` bash
(env)$ yarn build  # npm派の方はそちらで
(env)$ tree dist
dist
├── favicon.ico
├── index.html
└── static
    ├── css
    │   └── app.e2713bb0.css
    ├── img
    │   └── logo.82b9c7a5.png

    └── js
        ├── app.7c37a970.js
        ├── app.7c37a970.js.map
        ├── chunk-vendors.12262d8c.js
        └── chunk-vendors.12262d8c.js.map
        
4 directories, 8 files
```

ちゃんとstatic以下に静的ファイルが配信されているのが分かります.


## Django側の設定(vueapp)

まず, Djangoからvueの成果物(dist)を参照してレスポンスを返せるようにしていきます.

といってもSPAなので, エントリーポイントであるindex.htmlにだけルーティングをつけてあげればあとは
Vueが全部やってくれます.

<a id="chapter"></a>
### config/settings.py

``` python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'vueapp'  # <- 追加
]

...

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend/dist')],  # <- 修正 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

...

STATIC_URL = '/static/'
STATICFILES_DIRS = [  # <- 追加
    os.path.join(BASE_DIR, "frontend/dist/static"),
]
```

これで,

- htmlテンプレートの置き場: frontend/dist
- staticファイルの置き場: frontend/dist/static

であることをdjangoに教えてあげました.

 <a id="chapter"></a>  ### vueapp/views.py

views.pyからindex.htmlを返す関数を定義しておきます.

``` python
from django.shortcuts import render


def index(request):
    return render(request, 'index.html')
```

で, ルーティング書いてくんですが

- djangoではプロジェクト -> 各アプリケーションへのルーティング
- アプリケーション -> アプリ単位のルーティング

て感じでしていくらしいので, 

- config/urls.py : 大本のルーティング
- vueapp/urls.py : index.htmlへのルーティング
- api/urls.py : apiのルーティング

の3つを書く必要があるらしいです(apiの方はあとでやります)

 <a id="chapter"></a>  ### config/urls.py

まずは, プロジェクト側のルーティング.

``` python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('vueapp.urls'))  # <- vueapp/urls.pyのルーティングを追加
]
```

vueapp/urls.pyをインポートせずともincludeにテキストで渡してあげればいいとのこと. べんり.

 <a id="chapter"></a>  ### vueapp/urls.py

vueappのルーティングの設定をしていきま.

``` python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index')
]
```

これで,

プロジェクト['/'] -> vueapp['/'] -> index.htmlとルーティングが繋がりました.

 <a id="chapter"></a>  ### 走らせてみる

``` bash
$ cd path/to/myproject
$ python manage.py runserver
```

でサーバーを建てて(migrationしてないので怒られるけどサーバーは建つ),

http://127.0.0.1:8000/
にアクセスすると, vueの初期ページが表示されました！

ただfaviconだけ反映されてないようです.

vue(frontend)のdist直下を **HTMLテンプレートの置き場** として指定しているからhtml以外呼べないのかな?ってことで

dist/favicon.ico -> dist/static/favicon.icoに移動して,

index.htmlのルーティングも/static/favicon.icoに変更してみるとやはり上手く行きました.

buildするたびに移動させるのは骨なので, distではなくpublic(大本)の方を変更して起きます.


**public/index.html**

``` html
<link rel="icon" href="<%= BASE_URL %>static/favicon.ico">
```

また,  publicのディレクトリ構成を変更して

``` bash
$ tree public
public
├── index.html
└── static
    └── favicon.ico

1 directory, 2 files
```

になるように修正して, 再ビルドします.

``` bash
(env)$ yarn build
(env)$ python manage.py runserver
```

今度はファビコンもしっかり表示されました！

見た目の連携はこれで以上です.


## API開発

DjangoでのAPI開発については,

[Django REST Frameworkを使って爆速でAPIを実装する -Qiita](https://qiita.com/kimihiro_n/items/86e0a9e619720e57ecd8)
を参考にさせて頂きました.

こちらで紹介されているUserモデルをそのままapiに作っていきます.

**api/models.py**

models.pyではDBのモデルを定義します.

``` python
from django.db import models


class User(models.Model):
    name = models.CharField(max_length=32)
    mail = models.EmailField()
```

モデルが更新されたので, マイグレーションファイルを更新してmigrateしておきます.

``` bash
(env)$ python manage.py makemigrations
(env)$ python manage.py migrate
```

新しく
**api/serializer.py**
を作成して編集します.

serializerでは, 作成したモデルのパラメータのうちAPIとして扱うものを指定するそう.

``` python
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'mail')
```

**api/views.py**

``` python
from rest_framework import viewsets

from .models import User
from .serializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

**api/urls.py**

ルーティングを書きます.

先にも書いたように, 

- api/urls.py
- config/urls.py

を編集する必要があります.

``` python
from rest_framework import routers
from .views import UserViewSet


router = routers.DefaultRouter()
router.register('users', UserViewSet)
```

**config/urls.py**

``` python
from django.contrib import admin
from django.urls import path, include

from .urls import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('vueapp.urls')),
    path('api/', include(router.urls)),
]
```

これで完成！

``` bash
(env)$ python manage.py runserver
```

で, ブラウザからapi/usersにアクセスするとapi用のページが表示されました！
flaskのときはレスポンスが単に帰ってきてるだけだったので, これAPIとして機能するのかなって思って

curlしてみたら,

``` bash
(env)$ curl http://127.0.0.1:8000/api/users/
[]
```

ちゃんと帰ってきてました.

djangoすげー(小並感)


<a id="chapter"></a>
### VueからDjango REST APIを叩く

この時点で完成してるAPIはyarn serveしているvueからは叩けません(djangoの開発用URLを渡せばできるかもですけど本番とテストでルーティング変えるのはスマートじゃない).

てことで, django側の開発サーバーをvueに教えてあげます.

**vue.config.js**

``` javascript
module.exports = {
  assetsDir: 'static',
  devServer: {
      proxy: 'http://127.0.0.1:8000'  // <- djangoの開発サーバー
  }
}
```

これで, 連携が取れるようになったはず.

お試しに簡単なGETリクエストを送るボタンを実装してみます.

axiosを使います.

``` bash
(env)$ yarn add axios
```

**app.vue**

``` vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <button @click="get">GETするよ</button>  <!-- clickでgetメソッドを呼ぶ -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'  // <- axiosを読み込む

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  // 追加
  methods: {
    get: function () {
      axios
        .get('/api/users/')
        .then(request => {
          console.log(request);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
  // 追加終了
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

djangoの開発サーバーが建っていることを確認しつつ,

``` bash
(env)$ yarn serve  # npm派ならそっちでやってね
```

でサーバーを建てます(eslintの設定によってはconsole.logで怒られるかもしれません, 設定を変えてもいいですが今回は一応サーバーは建っているので割愛します.)

http://localhost:8080/
にアクセスするとvueの初期ページが表示されます.

おまけ程度に **GETするよ** ボタンが追加されていると思うので,

デベロッパツールを開きつつ, 押して見るとstatus: 200のレスポンスが無事帰ってきました！

このオブジェクトのdataに欲しい情報が帰ってきます.

今回は空リスト(Array(0))が帰ってきてるはずです.

flaskだとここでCORSエラー吐かれてたので, ちょこちょこ設定変えなきゃだったんですけどdjangoはデフォルトで対応してるみたいですね.


## GCEにデプロイ

デプロイまでする気はなかったんですけど, 割とスムーズにいけたのでそっちも試してみま.

AWSばっかだったので, 今回はGCPでいきます.

乞食ユーザーなので Always Freeで使いたい！！てことで,

[これから始めるGCP（GCE） 安全に無料枠を使い倒せ](https://qiita.com/Brutus/items/22dfd31a681b67837a74)

を参考にして,

リージョンをus-west1, 他は最小構成にインスタンスを作りました.

で, 接続で結構詰まったんですけど, とりあえずGoogle Cloud Shellからは簡単に接続ができるので接続してあげてから

``` bash
$ /home/<USER>/.ssh/authorized_keys
```

に公開鍵を置いてあげて, パーミッションを

- .ssh: 700
- authorized_keys: 600
- (ローカル)秘密鍵: 400

に設定して, 

``` bash
(env)$ ssh sample@[外部IP] -i ~/.ssh/[鍵名]
```

すれば接続できました！(authorized_keysの置き場がよくわからなくて時間が解けてしまった)

<a id="chapter"></a>
### ファイル郡の共有

とりあえずGithubリポジトリに置いてクローンして使いました.

Vueの.gitignoreにデフォルトでdistが入っててdistがgithubで配信されなくなってるので,

ここを直してからもってきました.

OS側の初期設定等については割愛しますが,

EC2ではpyenvがスムーズだったのでそっちで挑戦したんですけど不具合が多くて,

結局標準のPythonでやりました.

<a id="chapter"></a>
### djangoの設定

djangoはデフォルトでwsgi.pyも用意されてるので設定のデバックフラグを解除するだけ.

**settings.py**

``` python
DEBUG = False
```

<a id="chapter"></a>
### uWSGI

アプリケーション・サーバの設定.

とりあえず, デーモン用とテスト用の2種類を用意しました.

**test.ini**

``` ini
[uwsgi]
module = config.wsgi

processes = 4
threads = 2

max-requests = 1000
max-requests-delta = 100
master = true

; socket
socket = ./uWSGI/app.sock
; socket = :8080
chmod-socket = 666

; LOG
logto = ./uWSGI/app.log
pidfile = ./uWSGI/app.pid

vacuum = true
die-on-term = true
```

**deamon.ini**

``` ini
[uwsgi]
module = config.wsgi

processes = 4
threads = 2

max-requests = 1000
max-requests-delta = 100
master = true

; socket
socket = ./uWSGI/app.sock
; socket = :8080
chmod-socket = 666

; LOG
daemonize = ./uWSGI/app.log
log-reopen = true
log-maxsize = 8000000
logfile-chown = on
logfile-chmod = 644
pidfile = ./uWSGI/app.pid

vacuum = true
die-on-term = true
```

ソケットとログ等の置き場となるuWSGIディレクトリも作っておきます.

``` bash
$ tree -L 1
.
├── LICENSE
├── README.md
├── api
├── config
├── db.sqlite3
├── env
├── frontend
├── manage.py
├── vueapp
├── test.ini    # <- 追加
├── deamon.ini  # <- 追加
└── uWSGI       # <- 追加
```

構成はこんな感じになりました.



<a id="chapter"></a>
### nginx

こっちで少しハマりました.

そのまま起動すると, 画面が真っ白.

で, 結論から言うとstaticファイルが一切読めてませんでした.

[公式ドキュメント](https://docs.djangoproject.com/ja/2.2/howto/static-files/deployment/#serving-static-files-in-production)
によれば, 開発環境ではstaticファイルをそのまま配信できるが, 本番環境では,

1. 特殊なコマンド(collectstatic)で, 本番環境用にstaticファイル郡を起き直してdjangoから配信
2. Webサーバーから配信

のどちらかで配信し直す必要があり,
2つ目の方法を推奨とのこと(詳しくはドキュメント).

で, 一応ドキュメントでは
[collectstatic](https://docs.djangoproject.com/ja/2.2/ref/contrib/staticfiles/#django-admin-collectstatic)
して, 集めたディレクトリをWebサーバーに教えてあげて配信する方法が紹介されていたけど,

元々dist/staticに集めてるわけだし静的ファイルの更新が起きるたびにコマンド叩くのもあれだからってことでNginxに直接staticを教えてあげることにしました.

てことで最終的な設定ファイルは以下のようになりました.

**nginx.conf**

``` conf
server {
    listen 80;
    server_name localhost;
    location /static {
        alias /home/[user]/[repository]/frontend/dist/static;
    }

    location / {
        include uwsgi_params;
        uwsgi_pass unix:///home/[user]/[repository]/uWSGI/app.sock;
    }
}
```

これで外部IPからアクセスしてみるときちんとvueの初期ページ(+申し訳程度のボタン)が表示されました！！

やったー！

- [今回使ったリポジトリ](https://github.com/kaito1002/DjangoVueSample)
- [デプロイ先(たぶんすぐ消す)](http://35.247.81.87/)






