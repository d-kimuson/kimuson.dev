---
title: "Python 言語メモ"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: "2019-07-26T14:15:48+09:00"
weight: 5
draft: true
---

ローカルで書いてたPythonの個人メモの移植です.

## 環境構築

Pythonの設置方法は,

- 標準のPython
- Pyenv
- Anaconda系 ディストリビューション

の③種類が主にある.

Anacondaはデータ分析向きで合わないし, パス管理がブラックボックス化されてるので初心者が使うと環境が汚れていずれ死ぬ(経験済み).

パス管理がめんどくさいので, 標準のPythonを使いたいけどPython自体のバージョンを切り替えたいことが割とあるのでPyenvで構築する.

``` bash
$ brew install pyenv
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
$ echo 'eval "$(pyenv init -)"' >> ~/.bash_profile
```

zshを使っている場合には, zshrcからbash_profileを読めるようにするか, 直接zshrcに書き込む.

Pyenv自体は構築できたので, バージョン変更や新規バージョンのインストールなど.

``` bash
$ pyenv install 3.7.3
$ pyenv global 3.7.3
$ pyenv versions
  system
* 3.7.3 (set by /Users/path/to/.pyenv/version)
$ python -V
Python 3.7.3
```

外部ツールなどでPythonの実行環境を渡す場合は, 標準パスにはPython3がないので注意する必要がある.

``` bash
$ which python
$ type python
```

等で取得して対応する.



## コメントアウト

\# から改行まではコメントになる

``` python
x = 10 # ここはコメント
y = 12 # yに12を代入！
```



## 変数

Pythonの変数は,

- 変数の宣言は不要( 直接呼び出して代入すればいい )
- 変数に型の概念なし -> 数値をいれといた変数に文字列入れ直すとかもできちゃう

``` python
x = 10 # 宣言が無いので, 即変数に代入
print(x)
x = "Taro" # 変数自体には型がないので, 同じ変数にまた別の型をいれ直すことも
print(x + "さんこんにちは！")
```



## 主要な型(タイプ)

無数の型があるけど主要なのは,

|   型(タイプ)   | 意味                                                     |
| :------------: | :------------------------------------------------------- |
|      int       | 整数                                                     |
|     float      | 少数                                                     |
|      str       | 文字列                                                   |
|      bool      | 真理値( True/False )                                     |
|      None      | null的なモノ                                             |
|     リスト     | 複数の値の羅列, 添字0から                                |
| ディクショナリ | 複数の値の羅列, 値に対する添字を設定する, Mapping Object |
|     タプル     | リストの定数版                                           |

<a id="chapter3-1"></a>

### 2. 型の確認
type関数で行う

``` python
type("我が名は山田太郎なり！") # str を返す
```

<a id="chapter3-2"></a>

### 3. キャスト(型変換)

キャストは, 型名()でする

``` python
name = "Taro"
age = 15

# ageは int型なので str型にキャストしないと連結(+)できない
print(name + "さんの年齢は, " + str(age) + "歳です.")
```

<a id="chapte4"></a>

## 演算子

- 四則演算子と比較演算子は一般的なモノと同じ
- 累乗を ** 演算子で計算できる
- 小数点以下切り捨ての除算を // 演算子で計算できる
- インクリメント( i++とか ), デクリメント( i-- )は無し => 代わりに i += 1とかを使う.

| オペランド | 意味                                   |       例        |
| :--------: | :------------------------------------- | :-------------: |
|     +      | 数値なら加算, 文字列なら連結           |     10 + 20     |
|     -      | 減算                                   |        -        |
|     *      | 数値なら乗算, 文字列なら繰り返し       |        -        |
|     **     | 累乗( x^y )                            |        -        |
|     /      | 除算( 小数点以下そのまま )             |        -        |
|     //     | 除算( 小数点以下切り捨て )             |        -        |
|     %      | 剰余算                                 |        -        |
|     =      | 代入                                   |      x = 3      |
|     ==     | 値が等しい( True/Falseを返す )         |     x == 10     |
|     !=     | 異なる( True/Falseを返す )             |        -        |
|     >      | より大きい( True/Falseを返す )         |        -        |
|     >=     | 以上( True/Falseを返す )               |        -        |
|     <      | より小さい( True/Falseを返す )         |        -        |
|     <=     | 以下( True/Falseを返す )               |        -        |
|    and     | 論理積( True/Falseを返す )             | x > 3 and y < 5 |
|     or     | 論理和( True/Falseを返す )             |        -        |
|    not     | 論理否定( True/Falseを返す )           |   not x <= 10   |
|     is     | 同じ( True/Falseを返す )               |     x is y      |
|     in     | 含むかどうかの判定( True/Falseを返す ) |  "a" in "Taro"  |

<a id="chapter4-1"></a>

### 1. is と == の違い

- == は等しい値かどうかを判定
- is は同じインスタンスかを判定
- isのが速い

isのが速いけど, 同一インスタンスかをみてる

値が等しいかをみたいことがほとんどだから基本 ==

一般的なisの用途は, **型の比較** のみ

Noneとかstrとかは **プログラム中に一つしか存在しないインスタンス** だから, type()の返り値とか使って型比較をするならisを用いる.


``` python
x = 10
y = 10
z = x

x == y  # True
x is y  # False
x == z  # True
x is z  # True

type(x) is int  # True
```




## 文字列( str型 )

文字列は,

- シングルクォーテーション(')
- ダブルクオーテーション(")
- トリプルクォーテーション('''または""")

のいずれかで囲む.

トリプルクォーテーションは複数行の文字列で, 改行を反映してくれる.

あと, 関数やクラスの上部に書いておくと各ツール等で関数やクラスの詳細を表示しようとしたときに出てくれるので簡易的な説明を書くのもGood.

``` python
value = 'abc'
name = "Taro"
message = """こんにちは！
はじめまして！
やっほー！"""
```

文字列(str型)に定義されたメソッド.

``` python
name = "taro".replace("t", "T") # 置換
year, month, day = "2018,10,11".split(",") # 分割
```

他にもたくさんある.

f""で記述するf-strings記法もある(3.6以降).

``` python
name = "Taro"
age = 20
weight = 19.765

print(f"{name}さんは, {age}歳で, 体重が{weight:.4g}キロ")
# Taroさんは, 20歳で, 体重が19.77キロ
```

例のように,

- 文字列に変数から文字列を埋め込む
- 文字列に数字を埋め込む(f-strignsならキャストしなくてOK)
- フォーマットを変更する

などの用途で使われる.

フォーマットの変更はformatメソッドでも可能だが, f-stringsのが平易.

フォーマットは,

``` markup
f"{<変数>:<オプション1><オプション2><オプション3>}"
```

で指定する

|          用途          | オプション1  |      オプション2      | オプション3 |
| :--------------------: | :----------: | :-------------------: | :---------: |
|        文字埋め        | 埋めたい文字 | >(左), ^(中央), <(右) |  埋める数   |
|         0埋め          |      0       |       埋める数        |             |
|    有効桁数で桁揃え    |      .       |     揃えたい桁数      |      g      |
| 小数点以下桁数で桁揃え |      .       |     揃えたい桁数      |      f      |
|        指数表記        |      .       |     揃えたい桁数      |      e      |
|        割合表記        |      .       |     揃えたい桁数      |      %      |
|       2進数表記①       |      b       |                       |             |
|       8進数表記①       |      o       |                       |             |
|      16進数表記①       |      x       |                       |             |
|       2進数表記②       |      #b      |                       |             |



## シーケンス型

配列ライクなもの全般を指す言葉.

具体的には,

- リスト
- タプル
- 文字列
- range
- その他リストライクなもの

などがある.



## リスト

- 多言語での *配列(Array)* の型制限がない版(一つのリストに複数の型が混在できる)
- []に カンマ(,) 区切りで入力する.
- 配列みたいに リスト[index]で要素にアクセス

``` python
Taro = ["Taro", 20, "1999年1月1日", "100"]
print(Taro[0] + "さんは" + str(Taro[1]) + "歳です")
```

<a id="chapter7-1"></a>

### 要素の追加

- リスト.append( value )
- リスト.insert( 挿入インデックス, value )

で行う.

普通に後ろに追加するだけならappendで, 場所選んで追加したいならinsert使えばOK.

ちな, 範囲外のインデックス指定して無理やり代入して追加するのは不可能.

index out of rangeみたいなError吐かれる.

``` python
sample_list = [0, 1, 2]
sample_list[3] = 3 # index out of range error
```

<a id="chapter7-2"></a>

### 要素の削除

- リスト.pop()
- リスト.pop(削除インデックス)

で行う.

popメソッドの削除インデックスを指定するデフォルト引数は末尾になってるから, 後ろから１個削除したいだけなら引数なし.

指定したとこから削除したいならインデックスを渡す.

ちなみに, popメソッドは削除した値を戻り値として返すので, 取り除いた値を取得することもできる.

<a id="chapter7-3"></a>

### スライス

``` markup
l = [/"aa",/"bb"/]
```

リストをこのように区切ってリストの一部を取り出すための記法.

前から0番目の区切り線と, 1番目の区切り線で抽出するときは

``` markup
l[0:1]  # ["aa"]
```

というふうに書く.

後ろからX本目の区切り線と指定することもできて,

``` markup
l[0:-1]  # ["aa"]
```

と書く.

``` python
l = [10, 20, 30, 40]
print(l[0:4])  # [10, 20, 30, 40]
print(l[:4])  # [10, 20, 30, 40]
print(l[0:])  # [10, 20, 30, 40]
print(l[1:3])  # [20, 30]
print(l[1:-1])  # [20, 30]
```

<a id="chapter7-4"></a>

### 内包表記

``` python
l = [10, 15, 20, 25]
l2 = [2*x for x in l if x % 2 == 0]
print(l2)  # [20, 40]
```

関数型プログラミングでよく使われる, map()やfilter()と同様の硬化が期待できるし, 内包表記のがわかりやすい.



## タプル型

- リストの定数版, 値が変更できない
- ()で囲んで, カンマ( , )区切り

``` python
t = (1, 2, 3)
```



## 文字列

文字列も文字の羅列だか一応シーケンス型.

互いにキャストしたり, in演算子も使える.

``` python
name = "Taro"
listed_name = list(name)  # ['T', 'a', 'r', 'o']
```


## range() 関数

for文と合わせてよく使う.

- 開始( デフォルトで0 )
- 終了
- 間隔( デフォルトで1 )

の３種類の引数で, シーケンス型の数字の羅列を作ってくれる関数.

``` python
range1 = range(5)  # [0, 1, 2, 3, 4]
range2 = range(1, 5)  # [1, 2, 3, 4]
range3 = range(1, 5, 2)  # [1, 3]
```

ただ, print(range1) しても range(0, 5)としか返してくれないから中身みたければ, list でキャストする必要あり.

## reversed() 関数

reversed() 関数は,

- シーケンス型の逆順を作ってくれる関数
- range関数とセットで使うか, 文字列の逆順取得とかで使う
- rangeはforループとセットで使うのが主な用途だけど, デクリメント系の回し方が非直感的(ずらしが必要)だからこいつの助けを借りる
- 生成されるのは list_reverseiterator( イテレータはリストではない )
- リストとして使いたいならキャストが必要

``` python
# 5, 4, 3, 2, 1, 0 を作りたい!!

# 直感的ではないけど, rangeから作る
sample2 = range(5, -1, -1)

# reversed(range( ... )) で作る
sample1 = reversed(range(6))
```

## ディクショナリ

- リストの数値ではなく, キーワードで要素にアクセスする版的な
- key( リストで言うインデックス ) と value( 要素 ) から成る
- Map型のオブジェクトで, 多言語とかだとMapで実装されてることもしばしば
- key : value と対を書き, カンマ( , )で区切って, {}で囲む

``` python
data_dict = { # 1行に書いてもおけ
    "name": "Taro",
    "age" : 20,
    "id": "100",
    "自己紹介": "ひま"
}

print( data_dict["name"] + "さんおはよう世界" )
```

### 1. キーとバリューのリストを取得

keys()メソッド とvalues()メソッド で, keyの一覧とvalueの一覧をそれぞれシーケンス型で取得できる.

``` python
keys = data_dict.keys() # dict_keys(['name', 'age', 'id', '自己紹介'])
values = data_dict.values() # dict_values(['Taro', 20, '100', 'ひま'])

# dict_keysはリストライクだけどリストじゃなくて不都合 => キャストすると利用が楽
keys = list(keys) # ['name', 'age', 'id', '自己紹介']
```

### 2. 値の追加と削除

- 値の追加は, 存在しないキーを指定して普通に代入すればおけ.
- 値の削除は, **pop(key)** メソッド ( 返り値は削除したバリュー )

``` python
dict1 = {
    "one" : 1,
    "two" : 2,
    "three" : 3,
}

# key : "four", value : 4 組の追加
dict1["four"] = 4

# key : "three", value : 3 組の削除( 取り出し )
poped_value = dict1.pop("three")

## 結果
## dict1.keys() = ['one', 'two', 'four']
## poped_value = 4
```

## for文

- 基本は,
``` python
for <変数> in <シーケンス型>:
    <変数>に関する処理 ...
```

て感じ.

リスト(かリストライクなもの)を用意してあげて, リストの中身を順番に変数に渡すっていう動作をする.

### 1. 多言語っぽいforループ

は,
[range関数](#chapter10)
で実装する.

``` python
for i in range(5):
    print(i, end=", ")
print()
# 0, 1, 2, 3, 4
```

こんな感じ.

### 2. リストを使ったforループ

リストの中身を順番に取り出していくループ.

``` python
names = ["tarou", "sora", "jiro"]
for name in names:
    print(name)
```

### 3. ディクショナリを使ったforループ

前述のように, keys()メソッドでキーをシーケンス型で取得できるので, これを使う.

``` python
for token in data_dict.keys():
    print(token)

for token in list(data_dic):
    print(token)
```

## if-elif-else文

基本形は,

``` python
if True:
    print("checked if")
elif True:
    print("checked elif")
else:
    print("checked else")
```

特に書くことないけど,

条件式に真理値以外を渡せば, キャストして判定してくれる.

|  型   |     False      |
| :---: | :------------: |
|  int  |       0        |
|  str  |  空文字( "" )  |
| list  | 空リスト( [] ) |

FalseじゃなければTrueになる(当たり前)

``` python
def introduction(intro=""):
    if intro:  # boolean(空リスト) -> 真理値
        print(intro)
    else:  # デフォルト引数ならここを通る
        print("自己紹介がないよ")
```

## while文

while文の基本形.

``` python
while(True):
    if True:
        break
    elif True:
        continue
```

特に書くことない.

## 関数

関数について.

### 1. 関数の定義

- 関数はdefで定義する
- lambda式で定義する無名関数もある
- Cみたいなプロトタイプ宣言は必要ない
- 必要な引数はカンマ区切りで羅列

**関数定義**

``` python
def hello_message(name):
    message = name + "さん, さあ一緒にhelloworld!!"
    return message
```

引数がない関数にしたいなら引数無しで定義すれば良いし, 返り値をなしで設計したければreturn文を書かなければ良いだけ.

**無名関数定義**

``` python
lambda name: f"{name}さん, さあ一緒にhelloworld!!"
```

ただ, 無名関数は関数型な書き方でよく使うが通常のオブジェクト指向プログラミングではあまり使わない.

強いて言うなら,

``` python
func = lambda name: f"{name}さん, さあ一緒にhelloworld!!"

func('Taro')  # Taroさん, さあ一緒にhelloworld!!
```

等.

### 2. 関数の呼び出し

普通に呼ぶだけ.

``` python
message = hello_message("Taro")
print(message)
```

### 3. デフォルト引数

Pythonには, Javaで言うオーバーロードがない代わりにデフォルト引数( 引数が与えられなかったときにデフォルト値を渡す )がある.

これで, 与えれた引数次第で処理を変えるように記述すればオーバーロードと同じような効果が期待できる.

``` python
def hello(name="名無し"):
    print(name + "さんこんちゃす")

hello() # 名無しさんこんちゃす
hello("Taro") # Taroさんこんちゃす
```

身近な例としては, 標準の
[print関数](https://docs.python.org/ja/3/library/functions.html#print)
.

end引数があって文末を選べるけど, 普段はデフォルト引数で改行文字(\n)になってるから, 普通に使うと勝手に改行される.

改行したくないprintは,

``` python
print("名前: ", end="")
print("たろう")
# 名前: こしかわ
# と表示される
```

みたいにすればおけ.

### 4. 可変長位置引数

引数の数を指定することなく, タプルで全ての引数を受け取る.

**\*<引数名>** の形で引数を定義する.

``` python
def sample(*args):
    print(args)


sample("AA", "BB", "CC")  # ('AA', 'BB', 'CC')
```

### 5. 可変長キーワード引数

引数の数を指定することなく, ディクショナリで全ての引数を受け取る.

**\**<引数名>** の形で引数を定義する.

``` python
def sample(**args):
    print(args)


sample(A="AA", B="BB", C="CC")  # {'A': 'AA', 'B': 'BB', 'C': 'CC'}
```

定義する側的には便利だけど, 引数の定義だけみればだいたいなにを渡せば良いかわかる通常の引数とデフォルト引数に対して, 可変長の2つはなにを求めているのかわかりにくくて好きじゃない.

## クラス

クラス(雛形) => インスタンス(実物)を生成.

``` python
class Human:  # ①クラス定義
    class_var = 0  # ②クラス変数

    def __init__(self, name="名無し"): # コンストラクタ
        self.name = name  # ③インスタンス変数

    def printName(self):  # ④メソッド定義
        print("名前: " + self.name)


human1 = Human("太郎")  # ⑤インスタンス生成
human2 = Human("次郎")

human1.printName()  # メソッド呼び出し
human1.printName()  # 次郎
```

①でクラス(雛形)を定義して, ⑤でインスタンスを生成.

インスタンスが生成されると, コンストラクタ(\__init__.py)が呼び出される.

クラスに関する変数は,

- クラス変数: クラス自体に定義されるもので同じクラスの異なるインスタンスでも値を共有する
- インスタンス変数: そのインスタンス自体が持つ変数

がある.

``` python
<クラス>.class_var  # クラス変数にアクセス
<インスタンス>.instance_var  # インスタンス変数にアクセス
```

という形でそれぞれアクセスできる.

基本的に, メソッドには **self** 引数を渡すが, これが自身のインスタンスを指し示す.

ゆえに, self.<メソッド名> や self.<変数名> でインスタンス自身からメソッドを呼び出したり, インスタンス変数にアクセスしたりできる.

## モジュールのインポート

主に３つの方法がある.

1. import モジュール
2. from モジュール import クラス
3. import モジュール as エイリアス

### 1. import モジュール

``` python
import sample_module

sample_class_instance = sample_module.sample_class()
```

ただこれだと長い.

sample_class使うときにsample_module.sample_class()て書くのは非生産的.

### 2. from モジュール import クラス

``` python
from sample_module import sample_class

sample_class_instance = sample_class()
```

<モジュール>から<クラス>をインポートするって書き方.

これなら長くなくて良き.

### 3. import モジュール as エイリアス

モジュール名に短いエイリアス(ニックネーム)を付けるというやり方.

サンプルコードとかだと, この手法が一番多い気がする.

``` python
import sample_module as sm

sample_class_instance = sm.sample_class()
```

### 4. 自作モジュールのインポート

自作モジュールを他の.pyファイルで利用するにはパスを設定する必要がある.

Bash利用者なら **~/.bash_profile** , Zsh利用者なら **~/.zshrc** 辺りに,

``` bash
PYTHONPATH=<設定したいパス>:$PYTHONPATH
export PYTHONPATH
```

を記述すると, モジュールが置いてあるパスとして認識してくれる

また, 自作モジュールをインポートしたい.pyファイル内で,

``` python
import sys
sys.path.append("<使用したい.pyが置かれてるディレクトリパス>")
import hoge
```

のようにすることでも手軽にインポートができる.

### 5. 自作モジュールの作成

[パッケージ作成](https://tech-k-labs.xyz/post/pip_github/#chapter1)

## 例外処理

例外処理は try-except-else-finally文で行う

|   文    | 用途                                     |
| :-----: | :--------------------------------------- |
|   try   | 例外が起こりうる処理                     |
| except  | 例外が起きたときの処理                   |
|  else   | 例外が起きなかったときの処理             |
| finally | (例外の有無に関わらず)最後に実行する処理 |

except節では,

- 例外オブジェクトを渡す(渡した例外を取得する)
- 連ねて複数の例外オブジェクトをキャッチも可
- 渡さなければあらゆる例外をキャッチ(バグの温床になるため非推奨)
- Exception は 基底クラスで, 上同様あらゆる例外をキャッチできる( 同様に非推奨 )

``` python
def divide( x, y ):
try :
    print( str(x) + " / " + str(y) + " = " + str( x / y ) )
except ZeroDivisionError as e1:
    print( e1 )
except TypeError as e2:
    print( e2 )
else :
    print( "正常実行されました！" )
finally :
    print( "divideの終了\n" )

# deivideの実行
print( "divide(2, 3)の実行" )
divide( 2, 3 )
print( "divide(\"2\", \"3\")の実行" )
divide( "2", "3" )
print( "divide(4, 0)の実行" )
divide( 4, 0 )
```

で, 実行結果が,

``` bash
divide(2, 3)の実行
2 ÷ 3 = 0.6666666666666666
正常実行されました！
divideの終了

divide("2", "3")の実行
unsupported operand type(s) for /: 'str' and 'str'
divideの終了

divide(4, 0)の実行
division by zero
divideの終了
```

例外があってもスルーしたいときはpass文

``` python
try :
    print( 4 / 0 )
except : # あらゆる例外をキャッチ
    pass
```

## 正規表現

reモジュールを使う

``` python
import re

searched = re.find_all("検索文字列", "被検索文字列") # 結果リスト
```

検索文字列に関して正規表現を使える

## プログラム中からUnixコマンドを実行

``` python
import subprocess

def run_commands(input):  # 文字列入力
    result = subprocess.run(input, shell=True, capture_output=True, encoding='utf-8')
    print(result.stdout)

run_commands("clear")  # clearを実行
run_commands("ls")  # lsを実行
run_commands("ls -l")  # ls -lのようにオプション付きもOK
```

標準でないコマンド(シェルスクリプトの自作コマンドなど)もすべて実行できる.

## 仮想環境構築

仮想環境の主な目的は,

本番環境と開発環境が異なるときに, 必要なパッケージとそのバージョンを移植できること.

標準のvenvを利用して, 仮想環境を構築する.

``` bash
$ python -m venv env_name  # 仮想環境構築
$ source env_name/bin/activate  # 仮想環境に入る
$ deactivate  # 仮想環境を出る
```

環境の移植は, 開発環境に置いて,

``` bash
$ pip freeze > requirements.txt
```

でパッケージのバージョンが記述されたrequirements.txtを用意して, 本番環境でも

``` bash
$ pip install -r requirements.txt
```

して必要なパッケージを揃えられる.
