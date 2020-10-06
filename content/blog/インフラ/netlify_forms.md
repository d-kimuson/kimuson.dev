---
title: "Netlify Formsが便利だった"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Netlify"
category: "インフラ"
date: "2020-07-16T13:10:39+09:00"
weight: 5
draft: true
---

僕は, アプリケーションサーバーが必要ない静的なサイトだったり,

SPAだったりを公開するときによく [Netlify](https://www.netlify.com/) を使います. 無料の範囲が広く, Github Pagesと違ってプライベートリポジトリからも公開できるので重宝してます.

で, 先日, 公開しているサイトにお問い合わせ機能をつけることになりまして, でも Netlify だけじゃ実装できないからどうしようかな〜って思ってたら, Netlify Formsというものを見つけました(管理ページにがっつりタブあるのに気づいてなかった).

使ってみたらかなり良さげだったので, 紹介します.

## Netlify Forms

[Netlify Forms](https://www.netlify.com/products/forms/) では, Netlifyでホスティングしているサイトにお問い合わせフォームを埋め込むことができます.

``` html
<form name="contact" method="POST" action="success.html" netlify>
...
</form>
```

form タグに `netlify` フラグを立ててあげて, あとは普通にフォームを作ってあげるだけです.

action は未指定でもいいけど, デフォルトの完了ページが表示されてしまう(英語だし, 当然ページの雰囲気も異なる)ので, お問い合わせ完了ページは自前で用意してあげたほうが良さそうです.

ざっとこんな感じ⇓.

``` html
<!-- index.html -->
<form name="contact" method="POST" action="success.html" netlify>
    <label for="input-name">お名前</label>
    <input id="input-name" type="text" name="name" placeholder="例: 山田太郎" required />
    <label for="input-content">内容</label>
    <textarea
      name='content'
      id='input-content'
      cols='50'
      rows='10'
      placeholder="内容を入力してください。"
      required
    ></textarea>
    <button type="submit">問い合わせる</button>
</form>
```

``` html
<!-- sucess.html -->
<p>お問い合わせを受け付けました</p>
<a href='/'>戻る</a>
```

フォーム埋め込んで, いつも通りデプロイかけると｢Netlify Formsが有効になったで！｣ってメールが来ます.

サイト設定の Forms => Forms notifications から通知設定を追加できます(メール or Slack or Webhook).

あとはお試しで, submit してみると投稿内容が保存され, 通知が送られてきます.

## SPA対応

SPAだと, 対応は以下の記事が参考になりました.

[Nuxt.jsでNetlifyのForms使ってみた - Qiita](https://qiita.com/nanaki14/items/007eae905d6305f75f6a)

要約すると,

- SPAだと, formがなくて認識してもらえないので, hidden な form を静的に置いて, Netlfiy側で認識できるようにする
- Form-Data形式でポストする

必要があるようです.
