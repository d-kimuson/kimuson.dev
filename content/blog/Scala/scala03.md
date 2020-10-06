---
title: "Scala ③ implict 暗黙の型変換と引数"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Scala"
category: "Scala"
date: 2019-12-26T09:38:25+09:00
weight: 5
draft: true
---

## 暗黙の型変換

暗黙的に行われる型変換を定義できるよって話

``` scala
object PlayGround {
  def main(args: Array[String]): Unit = {
    if (1) {
      println("True")
    } else {
      println("False")
    }
  }

  implict def int2boolean(n: Int): Boolean = n != 0
}
```

型が合わない値が呼ばれたときに探索範囲に implict メソッドが見つかったら自動で呼ばれる.

今回なら, Booleanが必要なのに, Intが呼ばれた => implictで装飾された (Int) => Boolean メソッドをみつけて呼ぶ.

### 暗黙クラスを使って, 既存クラスにメソッドを追加する

``` scala
class Sample  // ベース

implict class RichSample(val self: Sample) {
  def addedMethod(): Unit = println("Added Method is called")
}
```

これで, 

``` scala
val s`1 = new Sample()
s1.addedMethod()
```

で, new RichSample(s1).addedMethod()に置き換わって呼ばれる.

擬似的にメソッドを追加することができる

## 暗黙的引数

implictを使ってデフォルト引数的なことができる

``` scala
implict val implicteValue: Int = 10

def sampleMethod(implict implicteValue: Int): Unit = println(implictValue)
```

ただメソッド自体にデフォルト引数の機能があるわけだし, どこで差別化するのかなって思って調べてみたら stack overflowにピンポイントな質問が.

[implicit parameter VS default parameter value  -- stack overflow --](https://stackoverflow.com/questions/21479990/implicit-parameter-vs-default-parameter-value)

暗黙的引数は, 

- 値を探しに行くからコンパイル時間が長くなる
- デフォルト引数はデフォルト値の場所が明確だが, implictはどこにでもかけるからよりわかりやすいのは前者

などの理由でよろしくないので, 基本的にはデフォルト引数を使うべきらしい.

違いとして, デフォルト値の定義場所が呼び出す側(implict)か, 呼び出される側(default)かの違いがあるので, 必要に応じてそこも考えながらどっちを使うかって感じらしい.

実際, Playフレームワークの Controller の request呼び出しには暗黙的引数が使われてた.

requestをインポートするなりしてdefault値にわたすより, すっきりしてたりこういう呼び出し元ベースの物を使うときはimplictを使うべきなのかもしれない.

次は [Scala ④ 共変と非変](/post/scala04)