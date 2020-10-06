---
title: "Python Datetimeについて調べる"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: "2020-05-29T14:52:29+09:00"
weight: 5
draft: true
---

python で時間を扱うときは大抵 `datetime.datetime` を使うけど, 理解が甘かったのでちょっと調べてみる.

## 準備

``` bash
$ pip install pytz
```

``` python
from datetime import datetime, timedelta
from pytz import timezone, utc

jst = timezone('Asia/Tokyo')
```

## aware と naive

datetime object は, タイムゾーンの有無で2種類にわけられる.

タイムゾーン情報を持つものを naive と呼び,
タイムゾーン情報を持たないものを aware と呼ぶ.

コンストラクタや, datetime型を取得するメソッドなどでタイムゾーン情報を指定しない場合は aware が, 指定した場合は naive が返される.

``` python
now_aware = datetime.now()        # datetime.datetime(2020, 5, 28, 22, 2, 42, 634478)
now_naive = datetime.now(tz=utc)  # datetime.datetime(2020, 5, 28, 13, 3, 0, 220156, tzinfo=<UTC>)
```

## LMT問題

本来 datetime の仕様としては, コンストラクタにタイムゾーンを渡すのだが, pytzにおけるJSTを渡すと意図した挙動にならない.

``` python
datetime(year=2020, month=1, day=1, tzinfo=jst)  # datetime.datetime(2020, 1, 1, 0, 0, tzinfo=<DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>)
```

見ての通り, 19分ずれている(本来の時差は+9:00).

[天文学辞典 » 地方時](http://astro-dic.jp/local-time/)

によると, 地方時には

- Local Mean Time(国で統一化されてない)
- Local Standard Time(国で統一化されている)

の2種類があり,

どうやら, datetime コンストラクタや一部のメソッドでは LMT が採用されてしまうとのこと.

てことで, めんどいけどLST(日本ならJST)として扱えるように用いるメソッド等を選ぶ必要がある.

## 仕様チェック

用途ごとに, LMTが採用されるのかLSTが採用されるのか確認していく.

### 現在時刻の取得

``` python
datetime.now(tz=jst).tzinfo          # <DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD> OK
jst.localize(datetime.now()).tzinfo  # <DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD> OK
```

どちらでもOK.

### 特定の時刻の取得

``` python
params = {'year': 2020, 'month': 1, 'day': 1}

datetime(**params, tzinfo=jst).tzinfo    # <DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>
jst.localize(datetime(**params)).tzinfo  # <DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>
```

コンストラクタはNG, 特定の時刻の naive オブジェクトを取得するときは, `タイムゾーン.localize(aware)` を使う.

### naive => naive のタイムゾーン変換

すでにタイムゾーンを持つオブジェクトを別のタイムゾーンへ置換する

``` python
utc_time = datetime(**params, tzinfo=utc)  # datetime.datetime(2020, 1, 1, 0, 0, tzinfo=<UTC>)

utc_time.replace(tzinfo=jst).tzinfo  # <DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>
utc_time.astimezone(jst).tzinfo      # <DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>
```

`replace` メソッドはNG, `astimezone` メソッドはOK.

### まとめ

まとめると, LSTを用いたい場合は,

| 用途 | メソッド |
| :--- | :--- |
| 現在時刻の取得 | datetime.now(tz=jst) *or* jst.localize(datetime.now()) |
| 特定の時刻の取得 | jst.localize(datetime(**params)) |
| タイムゾーン変換 | utc_time.astimezone(jst) |

を使えば良い.

## 比較について

datetime型は, 標準の比較演算子を用いて, 比較ができる.

### aware vs aware

``` python
datetime.now() < datetime.now()              # True
```

当然できる.

### aware vs native

``` python
datetime.now(tz=jst) < datetime.now()      # TypeError: can't compare offset-naive and offset-aware datetimes
```

できない.

### naive vs naive (同タイムゾーン)

``` python
datetime.now(tz=jst) < datetime.now(tz=jst)  # True
```

当然できる.

### naive vs naive (別タイムゾーン)

``` python
datetime.now(tz=jst) < datetime.now(tz=utc)  # True
```

タイムゾーンをまたいでも問題なく比較できる.
