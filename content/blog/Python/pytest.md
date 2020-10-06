---
title: "Pytestでテスト駆動開発"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "pytest"
category: "Python"
date: "2020-02-19T18:54:13+09:00"
weight: 5
draft: true
---

pytest でTDDっぽいことをしてみる

## ことのはじまり

- [ワイのテスト駆動開発〜偶数ハロー株式会社〜 - Qiita](https://qiita.com/Yametaro/items/3c537c003e6b1569d9e5)
- [50 分でわかるテスト駆動開発 - channel9](https://channel9.msdn.com/Events/de-code/2017/DO03)

この辺を見て, ちょっと真似てみようかなって思った.

後者で扱っていた fizzbuzz 問題を pytest で解いてみた.

リポジトリは [ここ](https://github.com/kaito1002/Tdd) .

## 設定

``` bash
$ pip install pytest
```

で, pytest を取得する

``` ini
[pytest]
addopts = -v --ff
python_classes = T_*
python_functions = case_*
```

動画では, テストを日本語で書くことを推奨していた(一種のドキュメントだから).

てなると, デフォルトの識別名はちょっとあわなかったのでその辺も書き換えておく.

これで,

``` bash
$ py.test
====================================================================================== test session starts =======================================================================================
platform darwin -- Python 3.7.5, pytest-5.3.5, py-1.8.1, pluggy-0.13.1 -- /Users/kaito/Playground/Python/TDD_Tutorial/src/.venv/bin/python3
cachedir: .pytest_cache
rootdir: /Users/kaito/Playground/Python/TDD_Tutorial/src, inifile: pytest.ini
plugins: cov-2.8.1
collected 5 items                                                                                                                                                                                
run-last-failure: rerun previous 2 failures first

test_fizzbuzz.py::T_その他::case_1を渡したら文字列1を返す PASSED                                                                                                                           [ 20%]
test_fizzbuzz.py::T_その他::case_2を渡したら文字列2を返す PASSED                                                                                                                           [ 40%]
test_fizzbuzz.py::T_3の倍数::case_3を渡したらFizzを返す PASSED                                                                                                                             [ 60%]
test_fizzbuzz.py::T_5の倍数::case_5を渡したらBuzzを返す PASSED                                                                                                                             [ 80%]
test_fizzbuzz.py::T_15の倍数::case_15を渡したらFizzBuzzを返す PASSED  
```

という感じでテストが行えるようになった

## Fixture の利用

pytestでは, fixture でDIしつつ, 初期化を共通化できるのでその辺も使った

``` python
@pytest.fixture
def fizzbuzz():
    return FizzBuzz()


class T_3の倍数:
    def case_3を渡したらFizzを返す(self, fizzbuzz):
        assert fizzbuzz.convert(3) == "Fizz"
```

便利〜

## githooks

おまけにローカルで自動テスト回るようにしてみた.

**.githooks/pre-push**

``` bash
#!/bin/bash

git rev-parse --show-toplevel && cd src && py.test
```

これで, push 前に自動テストが走るので安全.
