---
title: "TypeScript の Conditional Types の Infer の集約挙動を調べた"
description: "TypeScript の Infer を利用して特殊な型を取り出す方法を紹介します"
category: "TypeScript"
tags:
  - TypeScript
date: "2021-07-19T21:39:10Z"
thumbnail: "thumbnails/TypeScript.png"
draft: false
---

## 前提

TypeScript には、型レベルで条件分岐ができる [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) という型があり、Conditional Types の infer キーワードを使うことで特定のパターンにマッチする型を抽出することができます

説明するより実際に型を見たほうが早いと思うので、例を出します

```ts
type ExtractArrayT<T> = T extends (infer I)[] ? I : never;
type Res1 = ExtractArrayT<string[]>; // string
type Res2 = ExtractArrayT<number[]>; // number
```

Res1 では、T に `string[]` を渡しているので、string が型変数 I に渡り、string 型が帰ります

これだけでもとても便利なんですが、T が複数の型をまとめた型(具体的には共用体型と交差型)の場合に、I を取り出す時に面白い集約の仕方をして、普通では取れない型を取り出すことができます

この辺りの挙動を調べたので紹介します

## 調べる

前提のところで `Array<T>` を使ったので、同様に Array を例にあげて説明します

合成するためのもとになる型を準備します

```ts
type Obj1 = { key1: string };
type Obj2 = { key2: string };
```

この 2 つの型をそれぞれ `Array<T>` 型にマップします

```ts
type Arr1 = Array<Obj1>; // = Obj1[]
type Arr2 = Array<Obj2>;
```

このとき、`Arr1 & Arr2` と `Arr1 | Arr2` を infer で 1 つの型に集約してやります

```ts
type ArrUnion = Arr1 | Arr2 extends Array<infer Obj> ? Obj : never; // Obj1 | Obj2
type ArrIntersection = Arr1 & Arr2 extends Array<infer Obj> ? Obj : never; // { key2: string }
```

ArrUnion は自然な挙動ですが、ArrIntersection の方は交差型ではなく最後の型が拾えています。

こんな感じで同様に、関数の引数/戻り値、タプル(`[T]`)、オブジェクトのプロパティ、直接(`T`) のパターンを調べました

## 結果

結果は以下の通りです

| 型                | 共用体から集約 | 交差型から集約  |
| ----------------- | -------------- | --------------- |
| `T`               | A \| B         | A & B (never)   |
| `() => T`         | A \| B         | B               |
| `(k: T) => void`  | A & B (never)  | B               |
| `Array<T>`(`T[]`) | A \| B         | B               |
| `[T]`             | A \| B         | B (unknown)     |
| `{ key: T }`      | A \| B         | A & B (unknown) |

じゃん

共用体 → 共用体、交差 → 交差は特に面白みがないですね

- `() => T`, `(k: T) => void`, `Array<T>` の交差型を集約すると B が取れる
- `(k: T) => void` の共用体型を集約すると A & B が取れる

の 2 種類は、普通では取れない型が拾えています

## 応用する

じゃあこれでなにができるのって話ですが、そのままだと特になにもできません

`(() => string) & (() => number)` みたいな型は意図して作らないとなかなか作られないと思います

ただ、Union 型からスタートするなら、この辺りの型は全てパズルして作ることができます

### Union から 共用体ベースの集約パターンを作る

Conditional Types では、評価される型が型変数で、かつ共用体型のとき、型が分配される [Distributive Conditonal Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types) という性質があります

```ts
type DistributeArray<T> = T extends any ? T[] : never;
```

この DistributeArray 型に `string | number` 型を渡すと、直感的には `(string | number)[]` が受け取れる気がしますが、実際にはは `string[]` | `number[]` 型が帰ってきます

```ts
type Res3 = DistributeArray<string | number>; // string[] | number[]
```

これが Distributive Conditonal Types です

`T extends any` を評価するときに、型を一度分配してからまとめます

同様にこの動きを利用すれば、上の表の共用体から集約するパターンは全て作れることがわかります

```ts
type DistributeArg<T> = T extends any ? (k: T) => void : never; // ((k: A) => void) | ((k: B) => void)
type DistributeRet<T> = T extends any ? () => T : never; // (() => A) | (() => B)
type DistributeArray<T> = T extends any ? T[] : never; // A[] | B[]
type DistributeTuple<T> = T extends any ? [T] : never; // [A] | [B]
```

### Union から 交差型ベースの集約パターンを作る

共用体型からのパターンは作れることがわかりましたが、交差型はどうでしょうか

上の表で `((k: A) => void) & ((k: B) => void)` を集約すると A & B が受け取れることがわかっているので、交差型パターンも作れます

```ts
type UnionToArgIntersection<U> = (
  U extends any ? (k: (k: U) => void) => void : never
) extends (k: infer I) => void
  ? I
  : never; // ((k: A) => void) & ((k: B) => void)
```

やや複雑になってきましたが、やってることは

1. A | B を Distributive Conditonal Types で分配する
2. (k: (k: A) => void) => void) | (k: (k: B) => void) => void) ができる
3. Infer の集約挙動で交差型に変換する
4. `((k: A) => void) & ((k: B) => void)` ができた！

って感じです、同様に他の交差型からの集約パターンも作れます

```ts
type UnionToArrayIntersection<U> = (
  U extends any ? (k: U[]) => void : never
) extends (k: infer I) => void
  ? I
  : never; // A[] & B[]
// めんどうなので他は割愛
```

まとめると A | B みたいな型を持っている時、これらの挙動を利用して `① B 型を取り出すこと` と `② A & B 型を取り出せること`がわかりました

記事的にはこれで終わりでも良いんですが、せっかくなのでこれらから作れる便利な型をいくつか作ってみようと思います

### LastOfUnion

まずは、共用体型から末尾要素を取り出す型です

```ts
type LastOfUnion<U> = (
  (U extends any ? (k: U[]) => void : never) extends (k: infer I1) => void
    ? I1
    : never
) extends (infer I2)[]
  ? I2
  : never;
type Res4 = LastOfUnion<"hello" | "world" | "foo">; // "foo"
```

1. `A | B`
2. `((k: A[]) => void) | ((k: B[]) => void)`
3. `A[]` & `B[]`
4. `B`

って流れですね

配列じゃなくて関数の引数・戻り値でやっても良いですが一番短いので配列が良いと思います

### IsUnion

名前の通り、Union 型かどうかを判定する型です

```ts
type IsNever<T> = T[] extends never[] ? true : false;
type IsUnion<T> =
  IsNever<Exclude<T, LastOfUnion<T>>> extends true ? false : true;
```

IsNever は本筋じゃないので割愛しますが、never 型がどうかを判定できる型です

`Exclude<T, LastOfUnion<T>>` すると、Union 型から末尾要素を 1 つ除外した型を返します

T がそもそも 1 要素しかもたないとき(`Exclude<string, string>` とか)は、never が帰ってくるので、never か判定してやればその型が Union 型かどうかわかります

## 最後に

記事は以上になります

今回紹介した infer の集約挙動を用いると、普通の型変換では得られない型を取り出せるのでできることが広がります

もともとは、Union から過不足ないタプル型を作りたくてこの辺りを調べたので UnionToTuple も作ったんですが、それはまた別で書こうと思っているので今回は省略します

見てくれてありがとうございました :tada:
