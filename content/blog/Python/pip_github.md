---
title: "自作パッケージを Github から pip install できるようにする"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: "2019-08-15T09:56:52+09:00"
weight: 5
draft: true
---

Pythonの自作パッケージを Github で公開して, リポジトリから pip install できるようにする方法を解説します.

- pip登録はめんどそう
- パッケージ名被りもだるい
- でも, 作ったパッケージを配布したい

ってことで,

``` bash
$ pip install git+https://github.com/hoge/hoge
```

のように, pypiに登録せずに pip 管理化におけるようにする

## Contents

- [Contents](#contents)
- [パッケージ作成](#パッケージ作成)
  - [\_\_init\_\_.py](#__init__py)
  - [setup.py](#setuppy)
- [パッケージインストール](#パッケージインストール)

## パッケージ作成

パッケージのファイル構成の例として, 地点情報(Pointクラス)と線分情報(Segmentクラス)を扱うパッケージを挙げると以下のようになります.

``` bash
$ tree .
.
├── LICENSE
├── README.md
├── SamplePackage
│   ├── __init__.py
│   ├── Point.py
│   └── Segment.py
└── setup.py
```

### \_\_init\_\_.py

\_\_init\_\_.pyは, パッケージ読み込み時に必ず呼ばれます.

例えば, Point.py に Point クラスを定義する場合, 他ファイルからこの Point クラスを扱いたければ

``` python
from SamplePackage.Point import Point

p1 = Point()
```

としなければいけないので, あまりスマートではありません.

そこで, \_\_init\_\_.pyに

``` python
from .Point import Point
```

としておくと,

``` python
from SamplePackage import Point

p1 = Point()
```

このようにスマートにインポートできます.

`from SamplePackage` の段階で, `from .Point import Point` により, Point がモジュール名からその中のクラス名へ上書きされ, `import` 文で呼ばれるのが Point クラスへ置き換わっています.

### setup.py

``` python
from setuptools import setup, find_packages

readme = './README.md'
license = './LICENSE'

setup(
    name='パッケージ名',
    version='0.0.1',
    description='パッケージの詳細',
    long_description=readme,
    author='',
    author_email='',
    install_requires=[],
    url='パッケージのリポジトリのURL',
    license=license,
    packages=find_packages()
)
```

基本的には上を埋めればOKで, install_requires には依存関係のある外部パッケージ名を書いておきます.

**例**

``` python
from setuptools import setup, find_packages

readme = './README.md'
license = './LICENSE'

setup(
    name='SamplePackage',
    version='0.0.1',
    description='This is sample package!',
    long_description=readme,
    author='Taro Yamada',
    author_email='taro@mail.com',
    install_requires=['numpy', 'matplotlib'],
    url='https://github.com/taro/SamplePackage',
    license=license,
    packages=find_packages()
)
```

## パッケージインストール

リモートリポジトリに置けば,

``` bash
$ pip install git+<URL>
```

でパッケージをインストールできます.

閲覧ありがとうございましたー
