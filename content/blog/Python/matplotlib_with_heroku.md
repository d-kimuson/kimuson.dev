---
title: "Heroku 上でも matplotlib のグラフ描写をする"
date: "2018-09-27T03:48:22+09:00"
tags:
  - "Python"
  - "Heroku"
category: "Python"
thumbnail: "thumbnails/Python.png"
draft: false
---

Heroku でデプロイしたアプリ上で、matplotlib のグラフ描写するのに結構詰まったので対処法をまとめておきます

## エラー吐かれてそもそもデプロイできない

具体的には

> ImportError: No module named tkinter

を吐かれました

解決策は、tkinter(Mac標準)ではなく Agg を利用するように変更することです

``` python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
```

あるいは,
**matpotlibrc** をカレントディレクトリに設置して

``` txt
backend: Agg
```

と記述しておいても良いです

こちらの方法なら、毎回記述する必要もありません

## グラフの日本語が文字化けする 

デフォルトのフォントが日本語対応してないのが原因みたいです

適切なフォントをダウンロードして、matplotlib 側で指定していきます

[IPAexフォント ダウンロードページ](https://ipafont.ipa.go.jp/old/ipaexfont/download.html)より、IPAexゴシックをダウンロードして、ipaexg.ttf ファイルを `<project>`/.fonts/ に移動させます

その上で

``` python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

fontprop = FontProperties(fname='.fonts/ipaexg.ttf', size=10)
```

としておきます
あとは matplotlib でグラフ描写するときに

``` python
plt.xticks(<X軸リスト>, <X軸名前リスト(日本語)>, font_properties=fontprop)
```

という風に指定してあげればOKです


で、これも **matpotlibrc** に書いてしまえばめんどくさくなくて良きです

``` txt
backend             : Agg
font.family         : IPAexGothic
```
