---
title: "Scala ② クラスとオブジェクトとトレイト"

thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Scala"
category: "Scala"
date: 2019-12-26T08:06:28+09:00
weight: 5
draft: true
---



多言語でいうクラス, インタフェース的な概念としてScalaには

- クラス
- オブジェクト
- トレイト

がある.

## クラス

ふつーのクラス. 複数の抽象クラスを定義できない.

``` scala
abstract class Shape {
  def draw(): Unit = {
    println("未定義な図形")
  }
}

class Triange extends Shape {
  override def draw(): Unit = {
    println("三角形")
  }
}

class UnknownShape extends Shape

// コンストラクタ
class Sample(val x: Int)  // new Sample(1) => メンバ x = 1をもつSample インスタンス生成
```

## オブジェクト

インスタンスを1種類しか持たないクラス.

``` scala
object Sample {
  def hello(): Unit = {
    println("Hello World")
  }
}
```

用途は, 

1. エントリーポイント(main method)を作ること
2. メソッドの定義: 多言語の関数みたいな感じ, メソッドはどこかに属さなきゃいけないけどクラスに属するとインスタンスに紐付いちゃう
3. コンパニオンオブジェクト(=多言語で言うstatic method, value的なもの)

### コンパニオンオブジェクト

クラスと同名のオブジェクトをまとめて定義する

オブジェクトはインスタンスを1種類しかもたないのでstaticなメソッドや変数を扱える

``` scala
class Hoge(val x: Int) {
  def info(): Unit = println("value is " + x)
}

object Hoge {
  def sampleStaticMethod(): Unit = {
    println("This is static method!")
  }
}
```

## トレイト

クラスの多重継承は許されていないけど, 複数のトレイトはミクスインできる.

``` scala
class Sample extends A with B

abstract class base {
  def check(): Unit
}

trait A extends base {
  override def check(): Unit = println("trait A's method")
}

trait B extends base {
  override def check(): Unit = println("trait B's method")
}
```

で, この場合Sampleクラスのメソッドは右ほど優先されるのでtrait Bのものになる.

## その他

### case class

まともにクラスを作るには,

- toString: printとかのとき呼ばれる
- equals: ==での比較で呼ばれる
- hashCode: Mapの根になるために必要

辺りが有ると嬉しいよねーって感じで, 

case classは, これをまとめて作ってくれるのありがたい子.

``` scala
case class SampleCaseClass
```

### apply メソッド

applyは, メソッド名を省略したときに呼ばれる特殊なメソッド

``` scala
class Point(val x: Int, val y: Int)

object Point {
  def apply(x: Int, y: Int) {
    new Point(x, y)
  }
}
```

みたいにしておけば, val x = Point(1, 2)みたいにかけたりする(newを書かないので簡潔).

コレクションの各要素の呼び出し List(0, 1, 2, 3, 4)(0) とかに使われてる

### 装飾子

- public : 省略するとこれになる
- private/protected : Javaと同じ, コンパニオンオブジェクトオブジェクトなら双方からアクセスできる
- final: オーバーライド禁止

### 無名クラス

既存クラスを継承した無名クラスをその場で作れる

``` scala
object PlayGround {
  def main(args: Array[String]): Unit = {
    val s1 = new Sample("Sample")
    val s2 = new Sample("Sample2") {
      override def toString: String = s"Sample(name = $name)"
    }

    println(s1)  // Sample@xxxxxxx
    println(s2)  // Sample(name = Sample2)

    println(s1.getClass() == s2.getClass())  // false
  }
}

class Sample(val name: String)
```

当たり前だけど元のクラスとは別物.

今回は終わり.

次は [Scala ③ implict 暗黙的型変換と引数](/post/scala03)