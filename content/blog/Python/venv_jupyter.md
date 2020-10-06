---
title: "仮想環境からJupyter Notebookを使う"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Jupyter"
category: "Python"
date: "2020-07-14T11:31:04+09:00"
weight: 5
draft: true
---

Jupyter Notebookを仮想環境化で使う方法について.

Jupyterを使うこと自体は少ないんですけど, たまに使うことがあってそういうとき仮想環境がうまく適用できなくて困ります.

``` bash
$ python -m venv env && source env/bin/activate && pip install jupyter
$ python -m jupyter notebook
```

これだと, 仮想環境内にインストールされてるモジュールをインポートできない.

解決方法は, カーネルを仮想環境内からインストールすることです.

``` bash
$ python -m venv env && source env/bin/activate
(env)$ pip install jupyter ipykernel
(env)$ python -m ipykernel install --user --name=kernel_name
(env)$ python -m jupyter notebook
```

これで, カーネル選択時に `kernel_name` を選んで起動すれば, 仮想環境内のモジュールが使えました.
