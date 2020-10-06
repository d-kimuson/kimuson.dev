---
title: "Scala ⑤ パターンマッチ"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Scala"
category: "Scala"
date: "2019-12-31T16:57:25+09:00"
weight: 5
draft: true
---

強化版switch-case的な

## 値のパターンマッチ

``` scala
val value: Int = 0  // パターンマッチ用
val matched: String = value match {
  case 0 => "0だよ"
  case 1 => "1だよ"
  case 2 => "2だよ"
  case _ => "その他だよ"
}  // matched: String = "0だよ"
```

## 型のパターンマッチ

``` scala
val value: Int = 0  // パターンマッチ用
val matched: String = value match {
  case Int => "整数型だよ"
  case String => "文字列型だよ"
  case _ => "その他だよ"
}  // matched: String = "整数型だよ"
```

## マッチしつつ変数に束縛

``` scala
val value: Int = 0  // パターンマッチ用
val matched: String = value match {
  case intVal: Int => s"整数型だよ, intVal=$intVal"
  case strVal: String => s"文字列型だよ, strVal=$strVal"
  case _ => "その他だよ"
}  // matched: String = "整数型だよ"
```

## シーケンスとマッチ

``` scala
val value: List[Int] = List(1, 2, 3)
val matched: String = value match {
  case List(1, 2, 3) => "type A"     // [1, 2, 3]にマッチ
  case List(4, 5, 6) => "type B"     // [4, 5, 6]にマッチ
  case List(1, _, _) => "type C"     // 1から始まる要素数3のListにマッチ
  case List(1, a, b, c) -> "type D"  // 1から始まる要素数4のListにマッチして, 各値を束縛
  case List(1, _*) => "type D"       // 1から始まる任意の要素にマッチ
  case _ => "Else"
}
```

## コンストラクタでマッチ

``` scala
val human: Human = new Human(name="taro", male="男", age=20)

val matched: String = match human {
  case Human(name=_, male="男", age=_) => "男性"
  case Human(name=_, male="女", age=_) => "女性"
  case _ => "性別不詳"
}
```

## もっと柔軟に

### ifで条件式を追加

``` scala
25 match {
  case x: Int if x >= 10 => "10以上の整数"
  case x: Int => "10より小さい整数"
  case _ => "それ以外"
}
```

### OR条件で羅列

``` scala
2 match {
  case 1 | 2 | 3 => "type 1"
  case _ => "type 2"
}
```