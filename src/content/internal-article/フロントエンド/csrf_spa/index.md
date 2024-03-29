---
title: "SPA + WebAPI でアプリケーションを構築するときの CSRF 対策についてのメモ"
description: まだ書かれていません
category: "フロントエンド"
tags:
  - セキュリティ
date: "2023-01-29T22:25:37Z"
thumbnail: "thumbnails/フロントエンド.png"
draft: false
---

モノリス(MPA)だと、CSRF 対策として CSRF トークンを置いて検証するのが主流で、だいたいフレームワークに実装されてる機能を使うけど、SPA だと

- HTML は静的にビルドされるので、トークンを埋め込むことができない
- 埋め込むなら SSR をすることになるけど、BFF と API サーバーは一般に別なので、トークンの管理が大変
  - セッションを管理したいのは API サーバー (CSRF トークンはセッションに置いて API 呼び出し検証する必要があるので) だけど、CSRF トークンを set-cookie できるのは BFF のサーバーなので色々大変。考えたくない
  - まずもって(他の理由で SSR する必要があるならともかく) SSR もしたくないし
- 埋め込みではなく、ページロード後に API サーバーに CSRF トークンを問い合わせる案
  - 一応できなくはないけど、読み込み時の状態が複雑化するのでやりたくない (ロード → CSRF トークン取得 → interceptor の設定 → 認証トークン取得 → interceptor の登録 ...etc)
  - そもそも API サーバーにセッション置きたくないというのもある

って感じで CSRF トークンを前提にした対策は大変(やりたくない)なので、SPA 向けの対策についてまとめる

**※ これはあくまで個人的なメモ書きで、筆者はセキュリティについて専門性が低いのであしからず。**

## そもそも CSRF is 何

CSRF は、ブラウザが自動でクッキーを送る挙動を利用して、別ドメインに置いたフォームをユーザーに押させて認証を通す攻撃

例えば `https://attack.target.com` に下のフォームを置く

```html
<form method="POST" action="https://target.com/api/hoge">
  <input name="foo" type="text" />
  <button>なにかする</button>
</form>
```

ボタンをユーザーが押すと、クッキーが送られるのでセッションで認証してると悪意あるユーザーと正規のユーザーを識別できない

あとフォーム以外で、XmlHttpRequest で発生させることもできて、同じく `https://attack.target.com` にアクセスさせて

```js
XmlHttpRequest("https://target.com/api/hoge", {
  method: "POST",
  credentials: "include",
});
```

で投げることもできる

これらは set-cookie の挙動を利用して「サービスレベルの認証」を誤認させる攻撃だが、認証が絡まない API に於いても CSRF による危険性がある場合がある

匿名投稿ができるような要件のあるサービスでは、殺人予告等のセンシティブな投稿をさせた場合、「サービスレベルでその人が投稿したと誤任する」ことにはならないが、被攻撃者の PC から投稿があったという履歴が残ってしまうため問題になりうる

## そもそも対策の必要性はあるのか？

まず認証系について。

SPA の場合は、ステートレスにしたいために認証の方式としてセッションではなくトークンベースの認証を利用することも多い。

CSRF はリクエストにブラウザが勝手に cookie を付与することに起因するので、トークン(をヘッダに付与するような方式)で認証を行っている場合、CSRF は起こせない。よって CSRF 対策は不要。

非認証系については認証の方式は関係ないので、CSRF は起こせる

とはいえ、非認証系の CSRF で問題になるケースはかなり限られる(それこそ匿名投稿とか)

ので

- `API がセッションで認証をしている` または
- `匿名投稿等の機能要件が存在する`

場合に対策の必要性が高く、そうでない場合には低いと考えられる (サービスの要件も成長するものであるし、いずれにせよ対策しておくに越したことはないけど)

## 攻撃のパターン

ここまでの内容から

| 投げ方         | 認証 |
| -------------- | ---- |
| XmlHttpRequest | なし |
| XmlHttpRequest | あり |
| form           | なし |
| form           | あり |

の 4 パターンを防げれば、CSRF を全て防げる

## 対策 1: 異オリジンを弾く

XmlHttpRequest、フォームともに異オリジンのリクエストには `Origin: <オリジン>` ヘッダが送られてくるので、このオリジンが許可されたオリジンか検証するだけで良い

ただし、同一オリジンのときと、異オリジンでも `request.mode` が `cors` でないときは GET, HEAD の Origin は付与されないので GET, HEAD 以外のメソッドのみに有効。
CSRF が問題になるのは更新系のリクエストに限るので (GET で更新系を実装したりするやばい実装をしなければ) CSRF は防げる

(が、過去に Origin を偽装できる脆弱性もあったらしいので、ブラウザに脆弱性がある場合にのみ突破されうる)

参考:

- [Origin - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Origin)
- [InsertScript: Adobe Reader PDF - Client Side Request Injection](https://insert-script.blogspot.com/2018/05/adobe-reader-pdf-client-side-request.html)

## 対策 2: CORS + フォームからの送信(∋ 単純リクエスト)をブロックする

1 とは違って、CORS の一般的な設定がある前提で

- プリフライトリクエストによって XmlHttpRequest のパターンをブロック
- フォームからのリクエストはオリジン関係なく一括ブロック (Web API で通信しているならブロックして差し支えない)

する手法

### 前提: CORS で XmlHttpRequest は概ね防げる

XmlHttpRequest に関しては CORS を利用できる

- CORS の設定をしない or
- CORS の設定をするが、使う origin のみ指定する

という一般的な FW 推奨の CORS 対応がされていればプリフライトリクエストの時点で弾かれるので基本的に CSRF は成立しない

ただし

- POST
- 独自ヘッダなしのリクエスト
- Content-Type が `application/x-www-form-urlencoded` or `multipart/form-data` or `text/plain`

は更新系だけど、単純リクエスト扱いでプリフライトリクエストが発生しないので例外となる

参考: [オリジン間リソース共有 (CORS) - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

すなわち、CORS の一般的な FW 推奨の対応をした上で

- POST での単純リクエスト
- フォームからの送信

をブロックしてあげれば、CSRF は全て防げることになる

一応分けて書いたけど、これらは基本的に同一のもので。

MDN さんいわく

> その動機は、HTML 4.0 からの <form\> 要素（クロスサイト XMLHttpRequest と fetch に先行する）は、どのオリジンにでも単純なリクエストを送信できるので、サーバーを書く人はすでに cross-site request forgery (CSRF) から保護していなければならないからです。
>
> ...
>
> サーバーはフォーム送信のように見えるすべてのリクエストを受け取ることを（プリフライトリクエストに応答することによって）オプトインする必要はないのです。

で、オプトインする必要がないリクエスト(=フォーム送信のように見えるリクエスト)のことを単純リクエストと定義しているから、フォーム送信をブロックすることと、単純リクエストをブロックすることは基本的には同じこと

つまり、フォームからの送信だけブロックしてあげれば良い

※ 一般的な FW 推奨の CORS 対応:

`Access-Control-Allow-Origin: *` または 任意の Origin に対してオウム返しの `Access-Control-Allow-Origin` を返さない。未設定も可

具体的にフォームからのリクエストをブロックする手法は以下

### 対策 2-1: 固有のヘッダの有無を検証する

フォームでは HTTP ヘッダを付与できないので、なんらかのヘッダ(例として `X-Requested-With: XMLHttpRequest`)をクライアント側で付与して、それがないと弾かれるミドルウェアをサーバー側に設定すればフォーム送信はブロックできる

value の方はなんでも良くて検証もしなくて良い

一応 POST の単純リクエストも考えると、攻撃者は `X-Requested-With: XMLHttpRequest` ヘッダを設定しないと POST の単純リクエストを通せなくなるが、ヘッダを設定した時点で単純リクエストではなくなり、プリフライトリクエストが発生するようになるため、POST の単純リクエストもブロックできるようになる

| 投げ方         |                                    |                                                                        |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| XmlHttpRequest | POST の単純リクエスト (ヘッダなし) | ミドルウェアの `X-Requested-With` 検証で弾ける                         |
| XmlHttpRequest | POST の単純リクエスト (ヘッダあり) | ヘッダが付与されるので単純リクエストではなくなる。プリフライトで防げる |
| XmlHttpRequest | 上記以外の更新系リクエスト         | CORS 設定によって、プリフライトリクエストで弾ける                      |
| form           |                                    | ミドルウェアの `X-Requested-With` 検証で弾ける                         |

### 対策 2-2: Content-Type で application/json 以外をブロックする

[<form\> - HTML: HyperText Markup Language \| MDN #enctype](https://developer.mozilla.org/ja/docs/Web/HTML/Element/form#attr-enctype)

フォームの enctype で Content-Type を指定できるけど

- application/x-www-form-urlencoded
- multipart/form-data
- text/plain

しか選択肢がないので、WebAPI が `application/json` だけ受ければ良いならこの 3 つをミドルウェア等でブロックすればフォームからの送信をブロックできる

また、こちらも一応 POST の単純リクエストのパターンも考えると、Content-Type として `application/json` を指定した時点で単純リクエストである条件を満たせなくなるのでプリフライトリクエストが発生し、ブロックされるようになる

| 投げ方         |                                               |                                                                             |
| -------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| XmlHttpRequest | POST の単純リクエスト (application/json 以外) | ミドルウェアの `Content-Type` 検証で弾ける                                  |
| XmlHttpRequest | POST の単純リクエスト (application/json)      | application/json で投げると単純リクエストではなくなる。プリフライトで防げる |
| XmlHttpRequest | 上記以外の更新系リクエスト                    | CORS 設定によって、プリフライトリクエストで弾ける                           |
| form           |                                               | ミドルウェアの `Content-Type` 検証で弾ける                                  |

ただし、ファイルポストは `multipart/form-data` で送ることが一般的なので、例外的にこれを許可してしまったりすると攻撃が成立しうる

とはいえ、ファイルポストはデータを base64 encode して application/json でポストするという手法も取れるのでファイルポストに関しても application/json を使って...ということは一応できる

こんな感じ: [WebAPI でファイルをアップロードする方法アレコレ - Qiita](https://qiita.com/mserizawa/items/7f1b9e5077fd3a9d336b#base64)

## 対策 3: CSRF トークンを置いておいて、リクエストに付与を強制する

冒頭にも書いた HTML や cookie、トークンを受け取るエンドポイントを設置する等で CSRF トークンを仕込んでおき、リクエスト時にそれを検証する手法は SPA でも有効

ただやりたくない理由は冒頭でたくさん書いた通り。SPA で選択肢にすべきじゃないと思う

## 対策 4: Double Submit Cookie

ステートレスな CSRF 対策としてよく出てくるやつ。

1. サーバーで HTML をクライアントに返す時に乱数を生成して `Set-Cookie: csrf_token=<乱数>; Secure>` して返す
2. リクエストを投げるときには cookie からトークンを拾ってリクエストヘッダにつけて投げる
3. サーバー側で cookie の値とリクエストヘッダから渡ってきた値が同じ値か検証する

API サーバーにリクエストを投げる時、csrf_token はサードパーティークッキーになるのがミソで、サードパーティークッキーはサーバー上で設定されたものが送受信され、httpOnly とか関係なく攻撃者のサイト上の JS から参照・変更ができない

対して正規のページでは、API サーバーと同じドメインなら当然上記のように動くし、別ドメインの場合も domain 属性で上位ドメイン(`api.example.com` なら `example.com`)を指定することで API サーバーに対しても set-cookie されるので検証で弾かれなくなる (完全に別ドメインだと domain 属性で対応できないのでたぶん使えない、あまり言及されないので自身ないけど)

ちなみに、Double Submit Token は cookie が改ざんされない前提にあるため、脆弱性や経路での改ざん(中間者攻撃)で破られるらしい。ので融和策と考えるべき

参考: [解答：CSRF の防止策に関するチートシートにツッコミを入れる \| 徳丸浩の日記](https://blog.tokumaru.org/2018/11/csrf_26.html)

## まとめ

- WebAPI の CSRF 対策の必要性が高いのは `セッションで認証をしている` or `匿名投稿等の要件がサービスにある` とき
- ステートレス系の CSRF 対策はブラウザの仕組みに依存していてブラウザの脆弱性で破られうるので複数重ねておくのが無難

手軽で網羅できてるのは

- Origin ヘッダで許可されていないオリジンをブロックする
- 独自ヘッダ(`X-Requested-With: XmlHttpRequest`) の検証 + CORS の適切な設定

の 2 つで、基本はこれだけやっておけば良さそう(片方の脆弱性でも相当確率が低いので両方突破される脆弱性が同時に存在することはほぼないと考えて良いはず)。

より強固にしたい場合は

- Double Submit Cookie
- `Content-Type: application/json` 以外のブロック
  - ※ ファイルポストも base64 encode して json で送る制約が入り、通信のサイズ・encode/decode のコストが増える明確なデメリットがあるため注意が必要

を重ねることで、SPA に適した形で CSRF 対策ができる

## 参考

- [これで完璧！今さら振り返る CSRF 対策と同一オリジンポリシーの基礎 - Qiita](https://qiita.com/mpyw/items/0595f07736cfa5b1f50c)
- [今時の CSRF 対策ってなにをすればいいの？ \| Basicinc Enjoy Hacking!](https://tech.basicinc.jp/articles/231)
- [Cross-Site Request Forgery Prevention - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#Double_Submit_Cookie)
