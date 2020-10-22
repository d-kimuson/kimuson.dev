---
title: "DRFでサードパーティクッキーのセッション認証を使おうとして、諦めたけど勉強になった"
description: "DRFでサードパーティクッキーでログイン状態を持つために格闘した話について書きます。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "セキュリティ"
  - "Django"
category: "Django"
date: "2020-04-15T08:41:57+09:00"
weight: 5
draft: false
---

REST API + SPAなWebアプリを作っていて, 認証をどうしようかな〜ってなった.

本番環境は, Netlify に nuxt で構築したSPA(SSRはしない)を置き, DRFのAPIをHerokuにあげる

つまり, クロスドメインでの通信になる

ぼくの持ちうる知識では

1. APIサーバーでセッション認証(サードパーティクッキーとセッションで管理する)
2. APIサーバーでトークンベースの認証
    1. トークンを[ローカルストレージ](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)に置く
    2. ~~BFF層を置き、トークンをBFFサーバーのセッションに保存する(SSRしないので無理)~~

辺りが考えられた.

2-1はセキュリティ的によろしくない.

参考: [HTML5のLocal Storageを使ってはいけない（翻訳）｜TechRacho（テックラッチョ）〜エンジニアの「？」を「！」に〜｜BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2019_10_09/80851)

まあそりゃそうだよね.

クロスオリジンでの通信はCSRF対策でブラウザ側の制限が多く, おまけに今回はクッキーも使おうとしているので対応がめんどくなる.

## 必要な設定

[オリジン間リソース共有 (CORS) - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

を要約すると, クロスオリジンでのAPI通信を許可して, クッキーを使うには

- サーバーサイド
  - レスポンスヘッダに `Access-Control-Allow-Origin: <Origin>` を付与
  - レスポンスヘッダに `Access-Control-Allow-Credentials: true` を付与
- クライアントサイド
  - [XMLHttpRequest - Web API \| MDN](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest) に withCredentials フラグを建てる

をする必要がある.

## クライアントサイド

今回は nuxt と axios を使ったので, その設定を載せる

``` javascript
// nuxt用
$axios.onRequest(config => {
    config.withCredentials = true;
})
```

``` javascript
// API コール
axios
  .get("https://example.com/api/hoge/")
  .then(response => {
    // hoge
  })
  .catch(error => {
    // hoge
  })
```

これでOK.

他のライブラリでも XMLHttpRequest.withCredential が True になるように設定してあげれば大丈夫なはず.

参考: [XMLHttpRequest.withCredentials - Web APIs \| MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)

## サーバーサイド

前述のようにレスポンスヘッダに,

``` txt
Access-Control-Allow-Origin: <Origin>
Access-control-Allow-Credentials: True
```

を付与する必要がある

`Access-Control-Allow-Origin` には ワイルドカード(\*)を付与できるが, ブラウザ側がセキュリティの問題でワイルドカードの使用とクッキーの使用の共存を許可していないので, きちんと Origin を書いてあげる必要がある.

Middleware を書いて実装しても良いが, CORS対応用のパッケージ [django-cors-headers](https://github.com/adamchainz/django-cors-headers) があるのでこれを利用する.

``` bash
$ pip install django-cor-headers
```

``` python
CORS_ORIGIN_WHITELIST = [
    # Access-Control-Allow-Origin: <Origin>
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://example.com'  # 本番環境用
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True  # Access-control-Allow-Credentials: true
```

これで, `Access-control-Allow-Credentials: true` しつつ, リクエストとして送られてきた `<Origin>` が `CORS_ORIGIN_WHITELIST` に含まれていたときのみ `Access-Control-Allow-Origin: <Origin>` をオウム返ししてくれる.

ちなみに, `CORS_ORIGIN_ALLOW_ALL = True` はどんな Origin がきてもオウム返しする設定だが,

```python
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
```

はできないって記述をいくつかみた.

``` txt
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

が駄目な話と混同しているのか, パッケージが独自でブロックするのかわからないがセキュリティ的に良くないのは違いないので設定しないようにする.

### クロスオリジンだとクッキーがセットされない問題

これで一応ローカルの開発サーバーではうまくいったけど, 本番環境ではうまくいかなかった.

解決にかなり時間を溶かしたのだけれど, まとめると

レスポンスヘッダの Set-Cookie には, SameSite属性があり,

[HTTP Cookie - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies) によると,

> ブラウザーはクッキーの既定値を SameSite=Lax にするように移行しつつあります。 Cookie をオリジン間で送信する必要がある場合は、 None ディレクティブを使って SameSite の制限を解除してください。None ディレクティブは Secure 属性を必要とします。

つまり, クロスオリジンでの通信では `SameSite=None; Secure` を指定する必要があるが,

``` bash
$ http POST http://127.0.0.1:8000/api/users/login/ username=xxx password=yyy Origin:http://localhost:3000 Referer:http://localhost:3000/
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000
Allow: POST, OPTIONS
Content-Length: 28
Content-Type: application/json
Date: Mon, 06 Apr 2020 20:19:36 GMT
Server: WSGIServer/0.2 CPython/3.7.2
Set-Cookie: csrftoken=hoge; expires=Mon, 05 Apr 2021 20:19:36 GMT; Max-Age=31449600; Path=/; SameSite=Lax
Set-Cookie: sessionid=fuga4; expires=Mon, 20 Apr 2020 20:19:36 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax
Vary: Accept, Cookie, Origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "success": true,
    "user_id": 2
}
```

見ての通りDjangoでは `Lax` が デフォルト値となっている.

てことで,

[GitHub - adamchainz/django-cors-headers: Django app for handling the server headers required for Cross-Origin Resource Sharing (CORS)](https://github.com/adamchainz/django-cors-headers#cors_allow_credentials)

にしたがって,

``` python
SESSION_COOKIE_SAMESITE = None  # default='Lax'
SESSION_COOKIE_SECURE = True
```

を指定することで,

``` bash
$ http POST http://127.0.0.1:8000/api/users/login/ username=xxx password=yyy Origin:http://localhost:3000 Referer:http://localhost:3000/
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000
Allow: POST, OPTIONS
Content-Length: 28
Content-Type: application/json
Date: Mon, 06 Apr 2020 20:34:29 GMT
Server: WSGIServer/0.2 CPython/3.7.2
Set-Cookie: csrftoken=hoge; expires=Mon, 05 Apr 2021 20:34:29 GMT; Max-Age=31449600; Path=/; SameSite=Lax
Set-Cookie: sessionid=fuga; expires=Mon, 20 Apr 2020 20:34:29 GMT; HttpOnly; Max-Age=1209600; Path=/; Secure
Vary: Accept, Cookie, Origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "success": true,
    "user_id": 2
}
```

SameSite未指定(デフォルト値がNone), Secureが付与された.

ただ, 面倒なことに最近 Chrome がデフォルト値をLaxに変えたらしく, Chromeでは意図通りに動作しなかった.

参考: [Cookies default to SameSite=Lax - Chrome Platform Status](https://www.chromestatus.com/feature/5088147346030592)

てことで, Django での対応をしていく.

``` python
SESSION_COOKIE_SAMESITE = 'None'  # None => 'None'
```

は上手く行かなかった.

で色々調べたけど, Django での対応がまだらしく, テキストの None も渡せるようには修正されているが, まだ最新バージョン(3.0.5)にも反映されてなかった.

てことで, 現時点ではライブラリ自体を書き換えるか, 自前で Middlewareを準備するしかないっぽい.

#### 参考

- [chrome80でSameSite=Noneを明記しないといけなくなった問題、djangoユーザーはみんなどうしてるんだろう。 - Qiita](https://qiita.com/nakamumu/items/b60d68faf78831aae9a4)
- [Fixed #30862 -- Allowed setting SameSite cookies flags to 'None'. by danidee10 · Pull Request #11894 · django/django · GitHub](https://github.com/django/django/pull/11894)
- [django-polaris/middleware.py at master · stellar/django-polaris · GitHub](https://github.com/stellar/django-polaris/blob/master/polaris/polaris/middleware.py)

``` python:title=middleware.py
class SameSiteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        from config import settings

        for key in response.cookies.keys():
            response.cookies[key]["samesite"] = "Lax" if settings.DEBUG else "None"
            response.cookies[key]["secure"] = not settings.DEBUG
        return response
```

`Secure` 属性があると, ローカルの開発サーバーで意図通り動かなくなるので `DEBUG` みてわけるようにした.

- ローカル: `SameSite=Lax`
- 本番環境: `SamSite=None; Secure`

``` python:title=config/settings.py
MIDDLEWARE = [
    'middleware.SameSiteMiddleware',
    ...
]
```

これできちんと対応できた.

## CSRF Token 認証の無効化

CSRF保護のために, Djangoのセッション認証では `POST`, `PUT`, `DELETE` 等データ変更を伴うリクエストメソッドでは

1. クッキーでCSRFトークンを渡す
2. リクエストヘッダにトークンを渡す

ように義務付け, 一致するか確認している.

つまり, クライアントサイドで

1. クッキーからトークン(csrftoken)を取得
2. `X-CSRFToken: <token>` をリクエストヘッダに含めて送信

をする必要がある.

ただクッキーにはファーストパーティクッキーとサードパーティクッキーがあって, 別ドメインのサーバーから `Set-Cookie` したクッキーはサードパーティクッキーとして管理されるので

``` javascript
document.cookie
```

ではアクセスできないとのこと.

実際オリジン(localhost)が一致する開発サーバーでは取得できたが, オリジンが異なる本番環境では, トークンを取得できていなかった.

この辺のクッキーがオリジンごとに管理されてる云々の知識が薄かったので, とても苦労した...
そりゃそうだよね, document.cookieで全サイトのクッキー拾えちゃったらやばすぎだよね...

色々調べてみたけど, javascript から取得する方法はないっぽかった.

てなわけで, トークンチェックをしないようにした.

~~よくよく考えたらクッキーは送信してるんだから, ヘッダで送らずとも直接クッキーの中身をサーバーサイドで確認して認証すればよかった気がする.~~

``` python:config/settings.py
CSRF_TRUSTED_ORIGINS = [
    '本番オリジン',
    'localhost',
    '127.0.0.1'
]

REST_FRAMEWORK = {
    ...
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'middleware.MySessionAuthentication',
    )
    ...
}
```

``` python:middleware.py
from rest_framework.authentication import SessionAuthentication


def transform_referer_to_origin(referer: str) -> str:
    # http://hogehoge.com/hoge/var?key=value => http hogehoge.com /hoge/var?key=value => hogehoge.com
    protocol, _ = referer.split('://')
    return _.split('/')[0].split(':')[0]


class MySessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        """
        - トークンチェックは行わない
        - Refererだけ確認する
        """
        referer = request.META.get('HTTP_REFERER', None)

        if referer is None:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % "Reqeust Header に Referer が必要だよ")

        if transform_referer_to_origin(referer) not in CSRF_TRUSTED_ORIGINS:
            print(referer, " => ", transform_referer_to_origin(referer), "is not allowed.")
            raise exceptions.PermissionDenied('CSRF Failed: %s' % "Refererが信頼されてないよ")
```

これで意図通り動くようになった

## 今度はiPhoneから覗いたら結局上手く行かない

MacからもChromeとFirefoxは動くけど, Safariは駄目だった.

- [アップル、Safari 13.1であらゆる第三者Cookieをブロックへ。クロスサイトトラッキング防止徹底 - Engadget 日本版](https://japanese.engadget.com/jp-2020-03-24-safari-13-1-cookie.html)
- [Google Developers Japan: ウェブのプライバシー強化: サードパーティ Cookie 廃止への道](https://developers-jp.googleblog.com/2020/01/cookie.html)

Safariはサードパーティクッキーを完全ブロック, Chromeもプライバシー強化に向かいつつ2年以内に完全ブロックを目指すらしい.

てことで, ここまでやっといてなんだけど

- 同一オリジンから配信する => 普通にセッションで認証できる
- 異なるオリジンから配信する =>
  - セッション認証は無理
  - ローカルストレージに置く

て形になりそう.

確かにセッションのがセキュアだけど, そもそもXSSがある時点で驚異の大きさ自体は変わらないので

- トークンのリセット期間を適切に決める
- やばい操作にはパスワードでちゃんと認証をする(Githubとかちょくちょくパスワード求めてくるよね)

辺りをしっかりやれば良さそう

結局, トークン認証を採用したのでだいぶ無駄に時間を過ごしてしまったが, まあとても勉強になったので良かった.
