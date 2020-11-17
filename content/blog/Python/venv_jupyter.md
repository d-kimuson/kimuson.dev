---
title: "仮想環境下のJupyter Notebookを使う"
description: "仮想環境の下でJupyter Notebookを使う方法を紹介します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Jupyter"
category: "Python"
date: "2020-11-17T17:00:17Z"
weight: 5
draft: false
---

## 問題

仮想環境下にインストールした Jupyter では、パッケージを読み込むことができません

``` bash
$ python -m venv .venv && source .venv/bin/activate && pip install jupyter requests
$ python -m jupyter notebook
```

こんな感じで普通に建てると、

``` python
import requests
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ModuleNotFoundError: No module named 'requests'
```

インポート文でパッケージないで。って怒られます

## 対処法

カーネルを仮想環境内にインストールすることで対処できます

``` bash
$ python -m venv .venv && source .venv/bin/activate
(.venv)$ pip install jupyter ipykernel
(.venv)$ python -m ipykernel install --user --name=<カーネル名>
(.venv)$ python -m jupyter notebook
```

これで、**指定したカーネル名** を選ぶことで、仮想環境内のパッケージを使うことができます
