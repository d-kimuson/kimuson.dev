---
title: "PHPのマイクロフレームワークであるSlim3を触ってみる"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "PHP"
category: "PHP"
date: 2019-09-12T21:17:37+09:00
weight: 5
draft: true
---

今度開発をするインターンに参加する予定なのですが, PHPのマイクロフレームワークであるSlim3を使うらしいので軽く事前勉強をして置後と思います.

PHP自体ほぼ触ったことが無いのでできるだけ丁寧に.

## Composerの取得

composer は, PHP のパッケージマネージャです.

PHPにおけるスタンダードらしいので, Pythonでいうpip, Node.jsでいうnpmの立ち位置って感じでしょうか.

PHP自体はほぼ最新バージョンが初期で入っていたので, composerの導入のみしていきます.

``` bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

これでOK.

## Slimプロジェクトの作成

Slimは, PHPでWeb開発を行うためのマイクロフレームワークです.

Slimには, ディレクトリの雛形を作るコマンドがあるようです.

``` bash
$ composer create-project slim/slim-skeleton [Project Name]
```

マイクロフレームワークってことだったんで, Flaskみたいなのを想像してたんですけど, 雛形作ってみたら結構しっかりソースファイルが作成されてわけわかめだったので勉強として一回消して一個ずつ作ってみます.

## とりあえず最小構成を動かす

``` bash
$ mkdir myproject && cd myproject
$ composer require slim/slim "^3"
$ mkdir public
$ touch public/index.php  # 編集
$ tree . -L 2
.
├── composer.json
├── composer.lock
├── public
│   └── index.php  # <- エントリーポイント
└── vendor
    ├── autoload.php  # <- 読み込み用
    ├── composer
    ├── container-interop
    ├── nikic
    ├── pimple
    ├── psr
    └── slim

8 directories, 4 files
```

- public/index.php: エントリーポイント. ここに色々書いてく
- composer.json, composer.lock: パッケージ類の詳細. composer installで別環境でも同じパッケージを揃えられるもの(だと思う), とりあえず無視.
- vendor: 導入したライブラリの置き場
- vender/autoload.php を読み込むことでライブラリを使うことが可能になる(すなわちimport機構?)らしい.

phpは,

``` php
<?php
?>
```

で囲んで内部に書いていく(末尾の閉じタグは省略もできらしい.)

**index.php**

``` php
<?php
// vendorのライブラリの一括import
require '../vendor/autoload.php';

// Slim(Namespace)のAppインスタンスを作成.
$app = new \Slim\App();

// ルートへのルーティング, Hello Worldを返す.
$app->get('/', function($request, $response, $args) {
  $response->write("Hello World!");
});

// アプリケーションの起動.
$app->run()
?>
```

これが最小構成.

\Slim\App()は非常に気持ち悪いけど, 名前空間の一種らしい.

**path/to/vendor/slim/slim/Slim/App.php** を覗いてみると,

``` php
<?php
namespace Slim;

class App
{
    use MiddlewareAwareTrait;
...
```

が定義されていて, これを呼んでいる.

つまりSlim下に置いてあるAppクラスのインスタンスを作成するよ. ということ.

ちなみに, PHPのクラス機構ではメソッドやパラメータに対して->でアクセスするらしい.

起動は,

``` php
$ php -S 127.0.0.1:8000 -t public
```

で行う.

ブラウザで http://127.0.0.1:8000 にアクセスするとHello Worldが表示されます.

## 簡易的なapiの実装

普通, htmlテンプレートのレンダリングが先だろって感じがするけど,

api実装の紹介をしてる記事が多かったのでそっちを先に.

``` php
// public/index.php
$users = [
  [
    'name' => "Taro",
    'age' => 20,
    'passed' => "taro20",
  ],
  [
    'name' => "Jiro",
    'age' => 15,
    'passed' => "jiro15",
  ],
  [
    'name' => "Toshiro",
    'age' => 12,
    'passed' => "toshi12",
  ],
];

$app->get('/users', function($request, $response, $args) use ($users) {
  return $response->withJson($users);
});
```

データベースを用意するのはまだあれなのでとりあえず,

Jsonレスポンスの元となる連想配列(Map, ディクショナリと呼ばれるもの)を用意して返していく.

PHPでは,

``` php
$numbers = [0, 1, 2]
$ages = [
  'taro' => 20,
  'jiro' => 13,
  'toshiro' => 40,
]
```

のように, マップも配列も大括弧で書いていく(Arrayで書いてもいいみたいだけどこちらのが平易なのでこっちで).

要素へのアクセスは一般的な他言語同様に\[キー]でOK.

useは, グローバル空間にある変数を使うよっていう宣言.

引き数にとっている $responseにJsonを返すためのメソッドが組み込まれているので, そこに直接連想配列や配列を渡してあげればそのままJsonを返してくれる.

``` bash
$ curl http://127.0.0.1:8001/users
[{"name":"Taro","age":20,"passed":"taro20"},{"name":"Jiro","age":15,"passed":"jiro15"},{"name":"Toshiro","age":12,"passed":"toshi12"}]%   
```

パスワードまでAPIでアクセスしてしまうクソコードだけど一応jsonが帰ってきた.

非常に簡単.

## テンプレートのレンダリング

htmlソースを使ってレンダリング.

インターン先ではTwigをテンプレートエンジンとして使うそうなのでとりあえずそちらでやってみる(というかTwigがデファクトスタンダード臭い).

参考: [公式チュートリアル](http://www.slimframework.com/docs/v3/features/templates.html)

``` bash
$ composer require slim/twig-view
```

で導入する.

public直下にtemplatesディレクトリを置いて, index.htmlを設置する.

``` bash
$ tree public
public
├── index.php
└── templates
    └── index.html

1 directory, 2 files
```

で, index.phpに

``` php
$container = $app->getContainer();
$container['view'] = function ($container) {
  $view = new \Slim\Views\Twig('templates/');
  return $view;
};


$app->get('/index', function($request, $response, $args) {
  return $this->view->render($response, 'index.html');
});
```

コンテナってのがいまいちピンとこないけどとりあえず,

- $app->getContainer()['view']にテンプレートエンジンのインスタンスを置いてあげる
- テンプレートの置き場は, Twigインスタンス生成時に引き数として渡す
- すると, viewが扱うテンプレートエンジンとその置き場の整合性が取られて
- $app->view->renderにテンプレートフォルダ内のテンプレートファイルを指定すると無事レンダリングされる

ということらしい.

一応, 
http://127.0.0.1:8000/index
にアクセスすると置いたHTMLの内容が表示された.

テンプレートエンジンなので,

[Drupal8 Twigテンプレートの基礎](https://shared-blog.kddi-web.com/webinfo/207/)

にあるように, 色々と構文が使えるけど今回はとりあえずざっくりと全体の流れを見たいので, 細かい部分は割愛.

(その2があったらそっちでやりたい).

## データベース連携

データベースとの連携. 

どうやら自社製のCRUDライブラリを使うみたいなので割愛(ゴメンナサイ)

## docker-composeによるデプロイ

PHPにはアプリケーションサーバーが存在しないらしくて

というより, WebサーバーであるNginxやApache上でPHPプロセスを起こして結果をレスポンスとして返すということをやるそう.

CGIと呼ばれる方式らしい.

ただちょっと馴染みがないので, とりあえずPHPのビルドインサーバーを簡易アプリケーションサーバーとして利用してdocker-composeで動かしてみる.

``` bash
$ tree . -L 2
.
├── docker-compose.yml
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── phpapp
│   ├── Dockerfile
│   ├── composer.json
│   ├── composer.lock
│   ├── public
│   └── vendor
└── public
```

### docker-compose.yml

``` yml
version: "3.7"

services:
  slim:
    build: ./phpapp
    container_name: slim
    restart: always
    expose:
      - 8000
  nginx:
    build: ./nginx
    container_name: nginx
    restart: always
    ports:
      - "80:80"
```

### phpapp/Dockerfile

``` Dockerfile
FROM php:7-alpine
WORKDIR /phpapp
COPY . /phpapp
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
```

### nginx/Dockerfile

``` Dockerfile
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/
```

### nginx/nginx.conf

``` conf
server {
    listen 80;

    location / {
        proxy_pass http://slim:8000;
    }
}
```

とりあえず雑に繋げてしまったけど,

一応ブラウザからlocalhostにアクセスするとphpから建ててたのと同様にページが表示された.

キリが良いのでとりあえず今回はこれで終わりま！

次(があるかわからないけど)は,

- Webサーバー建ててデプロイしてみる(PHPならApache?)
- Slimスケルトンプロジェクトからちゃんと作る

とかとかをやりたい.
