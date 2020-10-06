---
title: "Circle CIをpytestで試す"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Docker"
  - "CircleCI"
category: "DevOps"
date: "2019-08-27T18:47:51+09:00"
weight: 5
draft: true
---

Circle CIを使ってみたかったので触ってみます！

テストは何でも良かったんですが, 一番pythonが使い慣れてるのでとりあえずpytestで.

今回使ったファイル等は
[ここ](https://github.com/kaito1002/CircleCITutorial)
に置いてあります.

## pytestとは

pythonの単体テスト用ライブラリ.

``` bash
$ pytest
```

とすると, 同ディレクトリ内のtest\_*.pyファイルを探して, test_*の関数を実行してくれる.

<a id="chapter1-1"></a>

### 使ってみる

``` python:title=calc.py
def add(x, y):
    return x + y
```

``` python:title=test_calc.py
adds_data = (
    [0, 0, 0],    # 0 + 0 = 0
    [0, 10, 10],  # 0 + 10 = 10
    [10, 0, 10],  # 10 + 0 = 10
    [5, 5, 10]    # 5 + 5 = 10
)


def test_add():
    for _ in adds_data:
        assert add(_[0], _[1]) == _[2]
```

みたいな感じ.

``` bash
$ pytest -v  # -vで見た目がわかりやすくなる
```

でテストを実行し,

テストデータと一致すればPASSし, 一致しないのがあるとエラーを吐く.

テスト関数の内容は毎回似たようなのになりそうだったので,

``` python
def create_test(f, args):
    def created_test():
        for _ in args:
            length = len(_)
            arg = _[:length-1]
            result = _[length-1]
            print(f"{arg} -> {result}")
            assert f(*arg) == result
    return created_test


test_add = create_test(add, adds_data)
```

とまとめてしまえば, create_test関数に, テストしたい関数と引き数を渡せばテストを作れるので楽できて良さそう.

一応動作確認.

``` bash
$ pytest -v -s
PASSED
```

テストデータいじるとちゃんとエラーはいてくれた.

### mark

機能が豊富すぎて把握しきれなかったので使いそうな mark と fixture だけ触ってみた.

``` python
import pytest
```

すると, pytest.mark.*デコレータが使える

``` python
@pytest.mark.hoge
def func():
    pass


@pytest.mark.skipif(True, reason="まだ実装してないよ")
def func():
    pass
```

前者(mark.hoge)は,

``` bash
$ pytest -v -m hoge
```

みたいにしてhogeデコレータがついてるやつだけテストを走らせるみたいなことができる.


後者(mark.skip)は, 第一引数に条件式をいれておいてTrueであればSkip(=テストを走らせない)して,

Falseなら走らせるってことができる. 環境変数を取得して, Macなら実行するーとかそういうのができる.

``` bash
$ pytest -v -rsx
```

### fixture

fixtureは前処理(データベースとか)を行うのに使う.

``` python
@pytest.fixture(scope='function')
def setup():
    print("start setup")
    print("fin setup")


def test_add(setup):
    pass
```

scopeは,

- function: テストケース毎
- class: テストクラス毎
- module: テストファイル毎
- session: テスト毎

に前処理を走らせる.

pytestには軽く触れたので, 本筋のCircle CIを触っていく.

## Circle CIとは

Circle CIは, Githubリポジトリと連携してCI/CDを提供してくれるサービス.

テストを予め書いといて, Githubのリポジトリが更新されるたびにテストが走る.

本来は, Git-flowを意識しつつ自動デプロイ等の設定もするべきなのだろうけど, 今回はとりあえず触ってみるだけ.

### 設定ファイルの準備

設定ファイルは, **.circleci/config.yml** に置く必要がある.

実行環境は, いくつか選択肢はあるが公式推奨のDockerコンテナを使う.

今回用意した設定ファイルは以下.

``` yml
version: 2.1
jobs:
  build:
    docker:
      - image: circleci/python:3.7.2
    steps:
      - checkout
      - run:
          name: install dependencies
          command: |
            python3 -m venv env
            source env/bin/activate
            pip install pytest
      - run:
          name: run test
          command: |
            source env/bin/activate
            pytest --junitxml=test-reports/junit.xml -v
```

- バージョンは最新が2.1
- docker image -> circleci用python3.7.2
- checkout: カレントのファイルをコピー
- install dependencies: venv構築とpytest取得
- run test: テストの実行

他にも色々設定できるから
[公式のドキュメント](https://circleci.com/docs/ja/2.0/configuration-reference/)
を参照しながら色々触ってみるべし.

### Circle CIでテスト

Githubリポジトリを作成したら,
[Circle CI](https://circleci.com/dashboard)
からGithubリポジトリを選択する.

あとは, リポジトリが更新されるたびにテストが走る.

以上.

あとは, docker-composeとの連携についても触ってみたい！