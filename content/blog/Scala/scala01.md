---
title: "Scala ① 関数とメソッド"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Scala"
category: "Scala"
date: "2019-12-25T10:18:43+09:00"
weight: 5
draft: true
---

静的型付け・関数型パラダイムとかとかに興味があったのでScalaを勉強してたんですが, ちょっと忙しかったのもあって日が空いちゃったので, まとめながらまた一から復習していこうかと思います.

今回はエントリーポイント(main)と作り方と関数について.

## 関数とメソッド

- メソッド: クラス, オブジェクト, トレイトとかに属するやつ
- 関数: 属さないやつ

メソッドは第一級オブジェクトでないので, 変数に代入したり, 関数やメソッドの引数・戻り値にできないが, 関数はできる.

### メソッド定義

``` Scala
object Sample {
  def hello(): String = "Hello World"                    // 1行パターン
  def hello2(): String = {                               // ブロック式でも書ける
    "Hello World"  // return 文は書かなくて良いが, 分岐先でreturnしたいときなどは書くこともできる
  }

  def hello3(arg: String): String = "Hello World"        // 引数あり
  def hello4(arg: String = "Hello World"): String = arg  // デフォルト引数
}
```

ちなみに, 引数のないメソッドは()がなくても呼び出せる

てことで, エントリーポイントになるmain methodを定義してみる

``` Scala
object Sample {
  def main(args: Array[String]): Unit = {
    println("Hello World")
  }
}
```

これで,

``` bash
$ scala test.scala
```

みたいに実行できるようになった(基本はsbtでやるけど).

### 関数定義

関数オブジェクトの作成は,

``` Scala
val f1 = sampleMethod _              // ① sampleMethod は定義済みメソッド
val f2 = () => println("called f2")  // ② 関数リテラルから
val f3 = new Function0[Unit] {       // ③ Functionオブジェクトを作る
  def apply(): Unit = {
    println("called f3")
  }
val f4 = new Function1[String, Unit] {
  def apply(arg: String): Unit = {
    println(arg)
  }
}
```

の3種類がある.

関数の実態は, f3の定義のようにFunctionN型のapplyメソッドで, Nは引数の数で22まで用意されている(①, ②も記述が違うだけで生成されている実態は同じもの)

前述のようにメソッドと違って関数は引数に代入できるので, 

``` scala
def sampleMethod(arg: String): Unit = println(arg)
def wrapperMethod(f: Function1[Unit]): Unit = {
  println("## Run Function ##")
  f
  println("## End ##")
}

val sampleFunction = sampleMethod _
wrapperMethod(sampleFunction)
```

みたいなことができる.

多言語的な関数の使い方をしたいだけなら, 適当なobjectにメソッドとして定義してあげれば良い, クラスと違ってインスタンスがあるわけじゃないから.

ただ関数型らしく引数に渡したりほげほげしたいときは関数オブジェクトとして扱う必要がある.

今回は終わり.

次は [Scala ② クラスとオブジェクトとトレイト](/post/scala02)
