---
title: "Python で .env ファイルから環境変数を取得する"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: 2020-02-15T19:39:11+09:00
weight: 5
draft: true
---

dotenv についてのメモ.

なにかプロダクトに関わっていると, 環境変数を使うことはよくあると思う.

で, チームだとその共有が面倒だなぁと思ったりしていたのだけれど(リポジトリにあげられないものもあるし, bashrcとかをいじってもらわないといけないから), どうやら .env ファイルに書くということが良く行われているらしい.

## dotenv の取得

pythonでは, dotenv というパッケージで扱えるとか.

``` bash
$ pip install dotenv
```

## .env ファイルの読み込み

たとえば, **.env** を下のように用意して,

``` text
HOGE_TOKEN='XXX'
```

読み込むことができる.

``` python
from dotenv import load_dotenv
import os

load_dotenv()
HOGE_TOKEN = os.getenv('HOGE_TOKEN')
```

トークンとか置くときは積極的に使おう.
