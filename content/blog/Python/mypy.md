---
title: "Mypy で型チェックをしよう"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "mypy"
category: "Python"
date: "2020-02-20T16:29:44+09:00"
weight: 5
draft: true
---

mypy で型チェックをしよう.



## content

- [mypyとは](#mypyとは)
- [なぜ型チェックをするのか?](#なぜ型チェックをするのか?)
- [基本的な型の利用](#基本的な型の利用)
- [既存プロジェクトへの追加](#既存プロジェクトへの追加)

## mypyとは

[mypy](https://github.com/python/mypy) は, Python の静的型チェックツールで, Pythonにおける [型ヒント](https://docs.python.org/ja/3/library/typing.html) の機能を利用して, 型チェック等をしてくれます.

``` bash
$ pip install mypy
```

で導入できます.

例えば,

``` python
# main.py
def devide(x: int, y: int) -> float:
    return x / y


if __name__ == "__main__":
    print("{} / {} = {}".format(10, 10, devide(10, 10)))
```

こんなスクリプトを実行するときに,

``` bash
$ mypy main.py && python main.py
Success: no issues found in 1 source file
10 / 10 = 1.0
```

といった風に, 実行前に型チェックをする(コンパイル言語みたいなイメージ)ってことが可能になります.

## 型チェックのなにが嬉しいのか

型チェックのメリットについてかんたんに.

### 1. 実行時例外を減らせる

実行に型の静的解析を挟むことで, 実行時エラーを静的解析時のエラーと実行時エラーに分割できます.

一般的に, 型の不一致で起こる例外は, 静的解析のほうが遥かにわかりやすいです.

``` python
def devide(x: int, y: int) -> float:
    return x / y


if __name__ == "__main__":
    print("{} / {} = {}".format(10, 10, devide(10, "こんにちは")))
```

例として, エラーを仕込んだこのスクリプトを静的解析ありとなしで実行してみると.

**静的解析なし**

``` bash
$ python main.py
Traceback (most recent call last):
  File "main.py", line 9, in <module>
    print("{} / {} = {}".format(10, 10, devide(10, "こんにちは")))
  File "main.py", line 5, in devide
    return x / y
TypeError: unsupported operand type(s) for /: 'int' and 'str'
```

1. main.py で `print("{} / {} = {}".format(10, 10, devide(10, "こんにちは")))` を実行し, 
2. devide 関数の `return x / y` において TypeError が発生しましたよ
3. x(int) / y(str) は できませんよ

という内容.

例外が *呼んだ関数の中* で投げられますし, そのために解決するには関数の中身の処理をある程度理解する必要があります.

まあ, 今回は単純な例なのでそんなに疲弊しないと思いますが, 対象の関数やメソッドが複雑になるほど追う処理が多くなって, エラー解決が難しくなります.

**静的解析あり**

``` bash
$ mypy main.py && python main.py
main.py:9: error: Argument 2 to "devide" has incompatible type "str"; expected "int"
Found 1 error in 1 file (checked 1 source file)
```

こちらは単純.

devide 関数を呼ぶときに, 第2引数は int を期待してたのに, str を渡してますよ.

関数の中身をを理解する必要もありません.

もちろん, 解析を挟むことで実行時例外がなくなるわけではありませんが, 引数に想定外の型を渡してるみたいな単純なエラーは静的解析で見つけてくれたほうが疲弊せずに解決できるでしょう.

### 2. 他人のコードが読みやすい！

人のパッケージを使おうとすると, 用途は分かっても戻り値の型が不明で苦労することはよくあります.

``` python
import requests

res = requests.get("https://tech-k-labs.xyz/")
```

例えば, requests.get は Http リクエストを投げてレスポンスを取得する関数ですが, 戻り値の型がはっきりしません.

dictで帰ってくるのか, 専用のクラスなのか, 後者ならどうやってデータを取れば良いのかわかりません.

``` python
print(type(res))  # <class 'requests.models.Response'>
```

type() で出力すればわかるけど, 毎回実行するのか?って話だし, 大きなパッケージだとソース読んでも色々な関数を跨いでたどり着くのに苦労するみたいなことは結構あります...

今回の, requests.get 関数の定義で言えば, 

``` python
def get(url, params=None, **kwargs):
    r"""Sends a GET request.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    kwargs.setdefault('allow_redirects', True)
    return request('get', url, params=params, **kwargs)
```

適切にコメントが書かれているので分かりやすいですが, 型ヒントの記述を強制することで全ての関数, メソッドで同じような恩恵を受けられるようになります.

``` python
from requests.models import Response


def get(url: str, params: Optional[Dict[str, Any]] = None, **kwargs: Any) -> Response:
    ...
```

こんな感じ.

あとやっぱり, 型が書いてあると最近のエディタは優秀なので, プラグイン等で直に確認できて便利です.

![参考画像](/media/images/mypy_sample.png)

ソースをわざわざ読みに行かなくていいのは割とありがたいです.

## 基本的な型の利用

型ヒントの書き方ですが, 組み込み型をメインに必要に応じて typing から, 必要な型を拾ってきて変数や引数, 戻り値に型ヒントを書けます

List, Tuple, Dict 辺りは, 何型を格納するコレクションなのかも型に書きたいので, 組み込みのものより typing のものを使うほうが推奨されます(というか解析で怒られるかな?)

``` python
from typing import List


def devide(x: int, y: int) -> float:  # 引数と戻り値の型付け
    return x / y


if __name__ == "__main__":
    results: List[float] = []  # 変数の型付け
    results.append(devide(5, 5))
    results.append(devide(4, 5))
    ...
```

例えばこんな感じ.

### メソッドの戻り値に自身のクラスを返す

``` python
class SampleClass:
    def __init___(self, x) -> None:
        self.x = x

    def copy(self) -> 'SampleClass'
        return SampleClass(self.x)
```

例えばコピー系のメソッドで, 戻り値で自身のクラスを書くときは, シングルクォーテーションで囲む必要があります.

### Optional型

関数には, デフォルト引数があり, Noneを渡しておくみたいなのはよくやる書き方だと思います.

先の例では関数の引数をチェックしただけでしたが, mypyでは, 他にも未定義のメソッドを呼ぼうとしてるよ? みたいなことも教えてくれるので,

このデフォルト引数の None または T型 を取るよみたいな変数を T型としておくのはあまり良くないです(None に対してT型にのみ定義されているメソッドを呼ぼうとしてるみたいなのを型チェックできなくなるので).

まあ言い換えれば, None または T型 ですよみたいな型があると都合が良いってことです.

これが, Optional\[T]型 です.

``` python
from typing import List, Any, Optional


def print_array(array: Optional[List[Any]] = None) -> None:
    if isinstance(array, List):
        for item in array:
            print(item)


if __name__ == "__main__":
    print_array(None)
    print_array(["Hello", "World"])
```

isinstance 関数でいわゆるパターンマッチができるので, 引数 array は None or List\[Any\]型であり, List\[Any\]型のときはこういう処理をします みたいな書き方ができます.

## mypy の設定

mypy の設定はオプションで渡してもいいですが, 設定ファイルにも書くこともできます.

結構自由度があるので, プロジェクトによって厳格な型チェックをいれたり, ゆるーくしたりできます.

mypy.ini に,

``` ini
  
[mypy]
disallow_untyped_defs = True

[mypy-requests.*]
ignore_missing_imports = True
```

と書いてみます.

これで,

- 型を書いてない関数, メソッド定義は怒られる => 型ヒントの強制
- ただ reqeusts パッケージに関してはその限りではない

って形にできます.

外部パッケージまで型定義を強制することはできないので, こういう感じになると思います.

安全性を守りたいなら,

``` python
from xxx import yyy, Y_Class

_: Any = yyy()
if isinstance(_, Y_Class)
    y = _
else:
    raise TypeError
```

みたいなこと書けば一応型安全には書けると思います.

ただ mypy のサポートも広がってきてるので, stub ファイル(型定義を書いた別ファイル)が提供されている場合もあります.

その場合は, それを含めてインストールすれば型付けの恩恵を受けられるでしょう.

``` bash
$ pip install django django-stub
```

詳細な設定の書き方は [ドキュメント](https://mypy.readthedocs.io/en/stable/index.html#) を見ましょう！!
