---
title: "Express触ってみる"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Express"
  - "TypeScript"
category: "Express"
date: "2020-07-29T20:00:06+09:00"
weight: 5
draft: true
---

なんとなくExpressを触ってみたかったので, 軽く調査する

- 遅いと思ってたけど, だいぶ高速らしい
- C10Kの解消(アプリケーション・サーバーではそれほど重要でもない?)
- BFF置くならおそらく最有力候補

## Typescriptをつかう

JSを使うときは, TSを使うのがとても人気のようだし, ぼくも型があるほうが好みなのでTypeScriptを使う.

まずは, 設定ファイル(tsconfig.json)を作る

``` typescript
$ npx tsc -init
```

初期設定の `tsconfig.js` が生成されたので, 自分用にカスタマイズしていく.

[Node Target Mapping · microsoft/TypeScript Wiki · GitHub](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)

ここに, 各Nodejsのバージョンにマップされた設定が載っているので, これで上書きしておく.

僕の場合は,

``` bash
$ node -v
v10.21.0
```

Nodejs10系なので,

``` json
{
  "compilerOptions": {
    "lib": ["es2018"],
    "module": "commonjs",
    "target": "es2018"
  }
}
```

これをコピってきた.

ただ, `console.log` を使うのに, `dom` が必要なので, 予めlibに追加しておく.

``` json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

その他細かい設定は, 以下がとても参考になる

[tsconfig.jsonを設定する - サバイバルTypeScript](https://book.yyts.org/handson/setting-tsconfig.json)

あとは, 実行方法だけど

- tscでコンパイルして, jsで動かす
- ts-nodeで動かす

どっちでもいいけど, めんどうなので `ts-node` でやる.

起動時にしかオーバーヘッドはないはずだし.

開発環境では, `nodemon` を使ってホットリロードだけできるようにしておく.

``` bash
$ yarn add typescript ts-node
$ yarn add -D nodemon
```

nodemon用に設定をかいてあげて

``` json
// nodemon.json
{
  "ext": "ts",
  "watch": [
    "src"
  ],
  "exec": "NODE_ENV=development ts-node ./src/app.ts"
}
```

これで, 開発サーバーにてホットリロードが有効になった.

あとは, `package.json` に, 起動スクリプトを書いてあげて

``` json
// package.json
{
  ...
  "scripts": {
    "start": "NODE_ENV=production ts-node ./src/app.ts",
    "start:dev": "nodemon"
  },
  ...
}
```

完成.

あとは, expressの起動用スクリプトを `src/app.ts` に置いてあげれば, 意図通り開発サーバーが起動する.

## Expressことはじめ

まずは, 最小限のコードで起動してみる

``` javascript
// src/app.ts
import express from 'express'

const app = express()

app.listen(3000, () => {
  console.log('start server');
})
```

めっちゃシンプル.

``` bash
$ yarn run start:dev
```

で, 問題なくサーバーが起動した(エンドポイントを作ってないので, とくになにかできるわけではない)

## Expressのらいふさいくる

Expressの動きはとてもシンプルだ.

[Express ミドルウェアの使用](https://expressjs.com/ja/guide/using-middleware.html)

によれば,

> Express アプリケーションは基本的に一連のミドルウェア関数呼び出しです。

とのこと.

つまり, リクエストのたびにミドルウェアと呼ばれる関数が連続して呼ばれる.

そして, 基本的なミドルウェアの実態は

``` javascript
(req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 処理
}
```

こんな感じ.

- req: リクエストオブジェクト
- res: レスポンスオブジェクト
- next: 次のミドルウェア関数

つまり, アプリケーションは以下のように構築される

``` javascript
// ①
app.use((req, res, next) => {
  // req & resを用いた処理
  console.log('middleware1');
  next()
})

// ②
app.use((req, res, next) => {
  console.log('middleware2');
  next()
})

// ③
app.use((req, res, next) => {
  console.log('middleware3');
  next()
})

app.use((req, res, next) => {
    res.sendStatus(404)
})

// start server
const portNum = process.env.PORT || 3000
app.listen(portNum, () => {
    console.log('start server in port: ', portNum)
})
```

①が呼ばれ, `next()` によって, ②が(以下略)という流れ.

試しに, http://localhost:3000 にアクセスすると, 全てのミドルウェアが呼ばれていることを確認できる

``` bash
start server in port:  3000
middleware1
middleware2
middleware3
```

サーバーからは, 404 Not Foundが帰ってくる.

エンドポイントの作成や, CORS処理層の追加や, 認証層やらいろいろ書くにしても, 全て実態はミドルウェア(req, res, next => {})なのでとても一貫性があってわかりやすい.

## HTTPメソッド

ミドルウェアの具体例として, エンドポイントの構築が考えられる

例えば, `/hoge` に対して, GETメソッドの応答をかきたいときは

``` javascript
app.use('/hoge', (req, res, next) => {
  if (req.method === 'GET') {
    res.send('Ok!');
    /*
      res.sendはレスポンスを返すメソッドで, callした時点でレスポンスが返される
      よって, 基本的に以降のミドルウェア(next)を呼ぶ必要はない
    */
  } else {
    next();
  }
})
```

と書ける.

冗長なので, 各HTTPメソッドに割り当てられたメソッドが定義されている

``` javascript
app.get('/hoge', (req, res, next) => {
  res.send('Ok')
})
```

基本はこちらで書くことになるだろう.

## JSONを返す

この辺で, JSONを扱えるようにしておく.

``` bash
$ yarn add body-parser
$ yarn add -D @types/body-parser
```

app に インストールしたミドルウェアを追加する

``` typescript
import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// json test
app.get('/hoge', (req, res, next) => {
    res.send({
        message: 'Ok'
    })
})
```

これで, `json` が扱えるようになった.

叩いてみる(by [HTTPie – command-line HTTP client for the API era](https://httpie.org/))

``` bash
$ http http://localhost:3000/hoge
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 16
Content-Type: application/json; charset=utf-8
Date: Sat, 25 Jul 2020 02:55:39 GMT
ETag: W/"10-/joFRKz/gr6105uVVzyNqD3EVJg"
X-Powered-By: Express

{
    "message": "Ok"
}
```

うん. いい感じ.

## Router

全てのエンドポイントを直接appに書いていては, さすがに管理もしにくいし, わかりにくいので `express.Router` を使うことができる

> ルーター・レベルのミドルウェアは、express.Router() のインスタンスにバインドされる点を除き、アプリケーション・レベルのミドルウェアと同じように動作します。

つまり, appではなく, `router: express.Router` にバインドされるミドルウェアを定義できる.

例えば, 一般的なREST APIを定義するなら以下のように書ける

``` javascript
// controller/article.js
import express from 'express'

const router = express.Router();

// 仮データストア
const articles = [
  {
    id: '1',
    title: 'hoge'
  },
  {
    id: '2',
    title: 'huga'
  }
]

router.get('/', (req, res, next) => {
  res.send(articles)
})

router.get('/:id', (req, res, next) => {
  const article = articles.find(article => article.id == req.params.id)

  if (article === undefined) {
    res.sendStatus(404)
  } else {
    res.send(article)
  }
})

router.post('/', (req, res, next) => {
  const title = <string>req.body.title;

  if (title === undefined) {
    res.status(400)
    res.send('titleが必要でっせ')
    return
  }

  const article = {
    id: String(articles.length + 1),
    title: title,
  }

  articles.push(article)
  res.status(201)
  res.send(article)
})

router.patch('/:id', (req, res, next) => {
  const title = <string>req.body.title;

  const article = articles.find(article => article.id == req.params.id)

  if (article === undefined) {
    res.sendStatus(404)
    return
  }

  if (title == undefined) {
    res.status(400)
    res.send('titleを確認してけろ')
    return
  }

  article.title = title
  res.send(article)
})

router.delete('/:id', (req, res, next) => {
  const article = articles.find(article => article.id == req.params.id)

  if (article === undefined) {
    res.sendStatus(404)
    return
  }

  res.sendStatus(204)
})

export default router
```

定義したルーターを, appの特定のルートに紐付ける

``` javascript
// app.js
import articleRouter from './controller/article'

app.use('/articles', articleRouter)
```

叩いてみる.

``` bash
$ http http://localhost:3000/articles/
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 53
Content-Type: application/json; charset=utf-8
Date: Sat, 25 Jul 2020 03:32:08 GMT
ETag: W/"35-ns5DXtFumfchCBnRUbIyzZgZXW4"
X-Powered-By: Express

[
    {
        "id": "1",
        "title": "hoge"
    },
    {
        "id": "2",
        "title": "huga"
    }
]

$ http http://localhost:3000/articles/1
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 25
Content-Type: application/json; charset=utf-8
Date: Sat, 25 Jul 2020 03:32:56 GMT
ETag: W/"19-esDHYv8jN3J7lXeZeQFbw7wFlvE"
X-Powered-By: Express

{
    "id": "1",
    "title": "hoge"
}
```

いい感じ.

リクエストボディ, パラメータの習得も容易だ.

## セッションの利用

ExpressでBFFを構築するなら, セッションを使いたい場面もあるはず.

``` bash
$ yarn add express-session
$ yarn add -D @types/express-session
```

例によって, これもミドルウェアなので, パッケージを App.use する

``` typescript
app.use({
  name: 'session-id',
  secret: process.env.SESSION_SECRET || 'secretkey(仮)secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  }
})
```

XSSへの驚異を多少軽減する意味でも, httpOnly=true,

開発環境だと必然的に http プロトコルが利用されるため. secureフラグはfalseにして置く必要がある.
当然本番環境ではtrue.

あとは, ミドルウェアの中で `req.session` から追加・変更・取得ができる.

``` typescript
(req, res, next) => {
  req.session.info = 'セッションに置いておく情報';
  const nameFromSession = req.session.info;
  ...
}
```

デフォルトだと, メモリにストアすることになるので, Redis等のストアを使うのも良いだろう.

今回は割愛する(もう疲れてきた).

## CORS設定

SPA + Web API的なアーキテクチャだと, 開発環境だと別でサーバーを立てることが多いからCORSを許可して上げる必要があることも多いよね.

``` typescript
const CORS_ALLOW_LIST = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

app.use((req, res, next) => {
    const maybeOrigin = req.headers['origin']

    if (maybeOrigin === undefined) {
        next()
        return
    }

    const origin = <string>maybeOrigin

    // CORS オリジン確認
    if (CORS_ALLOW_LIST.includes(origin)) {
        // 許可
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    // OPTIONS
    if ('OPTIONS' === req.method) {
        res.sendStatus(204)
    } else {
        next()
    }
})
```

あえて自分で書いてみた.
全体用にミドルウェア書くだけなので, わかりやすい.

当然, 提供されているcorsパッケージを利用してもOK

[cors - npm](https://www.npmjs.com/package/cors)

シンプルに,

``` typescript
app.use(cors());
```

すれば全許可されるっぽいけど, プリフライトのハンドリングは自前で書く必要があるみたい.

本番環境では気をつけてオプション並べてあげる必要がありそう.

詳しくは,

[Express cors middleware](https://expressjs.com/en/resources/middleware/cors.html) を参照.

ひとまずこれで終わり！

DB周り(TypeORMってのが良さそうだった)とか, もうちょっと試したいことあるけど, 疲れたから別記事に分ける.
