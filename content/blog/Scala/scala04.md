---
title: "Scala ④ 共変と非変"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Scala"
category: "Scala"
date: "2019-12-31T15:24:30+09:00"
weight: 5
draft: true
---

トレイトなりクラスなりを継承するときに, 親の型パラメータの継承関係を引き継ぐかどうかを指定するのが変位指定アノテーション.

- 共変: 継承関係を引き継ぐ
- 非変: 継承関係を引き継がない
- 反変: 継承関係を反転させる

もはや反変に関しては, どんなときに欲しくなるのかよくわからないので置いとく(反転するだけで共変と同じだし).

``` scala
class Animal
class Human extends Animal
class Anotation1[T](val arg: T)   // 非変
class Anotation2[+T](val arg: T)  // 共変
```

とクラスを定義しておいて,

``` scala
val animal = new Animal()
val human = new Human()

val ano1Human = new Anotation1[Human](human)
val ano2Human = new Anotation2[Human](human)
```

このとき,

``` scala
val inst1: Animal = human
```

これは, 親子関係だから親の型の変数に代入できる

``` scala
val inst2: Anotation1[Animal] = ano1Human
```

これは, Anotation1を非変で定義したので, 型エラーを吐かれる

``` scala
val inst3: Anotation2[Anumal] = ano2Human
```

共変なので, 代入できる

次は [Scala ⑤ パターンマッチ](/post/scala05)