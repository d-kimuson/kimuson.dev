---
title: "Flaskでチャットボット作った"
description: "Flaskでチャットボットを作りました。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Flask"
category: "Flask"
date: "2019-06-23T16:23:36+09:00"
weight: 5
draft: true
---

Flaskでチャットボットを作った.

Web系のフレームワークを使ってみたかったけど,

djangoはちょっと大きすぎて手に負えないし...って感じでflaskを触ってみた.

題材は友人がReactでチャットボット作ってたのでパクった.

## 作ったチャットボット

ちょっと前まで, discordのbotをHerokuで動かしていたけど,

最近動かすのをやめてしまい枠が残ってたのでせっかくだから Herokuで公開してみた.

[Chatbot](https://chatbot-flask-kaito.herokuapp.com/)

寂しくてたまらないときなどにぜひご活用下さい()

ソースコードは,

[flask_chatbot](https://github.com/kaito1002/flask_chatbot)

に載せてあります.

体系的にflaskの説明をしているサイトは五万とあるし, 僕自身も全然使い込んでないのでつまったところとかをざっと書いていきます.

## sessionを使う

最初はなんとなくグローバル変数に会話ログを載せてたんですけど, 複数のユーザーが同時にアクセスすると会話が混在してしまってやばいことになるなって感じで, sessionなるものの存在を知りました.

``` python
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'hoigeowooa'  # key for using session

@app.route('/postname', methods=['POST'])
def postname():
    name = request.form['name']
    session['name'] = name
    return "hoge"
```

というように, session(ディクショナリ型?)に値を渡しておけば値を保存できるし交わることもないとのこと.

参考: [PythonのFlaskで学ぶWebアプリケーション制作講座 第6章 〜セッション〜](https://qiita.com/ikaro1192/items/d890eefbdbbfe1460252)

## ページ再読込でのPOST重複を防ぐ

会話中にページを再読込すると, POSTが重複して直前の送信がもう一度行われてしまっていた.

POSTが2回行われていることはわかったので対策方法を調べていると

[Post/Redirect/Get (PRG) パターン](https://qiita.com/furi/items/a32c106e9d7c4418fc9d)

なる記事が.

こちらを参考にして, リダイレクトを利用することで再送されないように修正しました.

せっかくなので, 今後もちょくちょくWebアプリでよく使われる機能などを実装したりしながら, 付随して記事にしていこうと思います.

閲覧ありがとうございました.
