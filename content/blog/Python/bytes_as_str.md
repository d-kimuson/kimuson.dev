---
title: "Pythonでbytesを文字列に変換する"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "Python"
date: "2019-08-25T00:36:22+09:00"
weight: 5
draft: true
---

バイト列の文字列化について.

例えば, 文字列でエンコーディングすると

``` python
type('こんにちは'.encode('utf8'))  # bytes
```

みたいに, バイト列に変換されるんですがこういうのをpython外(SQLとか, APIとか)へ持ち出したいときはどうすればいいのかなーって思ってたんですけど, hex使えばいいっぽいです.

``` python
encoded = 'こんにちは'.encode('utf8')

hexed = encoded.hex()  # 'e38193e38293e381abe381a1e381af', type -> str
back = bytes.fromhex(hexed)  # bytes

decoded = back.decode('utf8')  # 'こんにちは'
```

以上です.
