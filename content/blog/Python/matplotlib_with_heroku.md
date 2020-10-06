---
title: "Heroku上でもmatplotlibのグラフ描写をする"
date: "2018-09-27T03:48:22+09:00"
tags:
  - "Python"
  - "Heroku"
category: "Python"
thumbnail: "/media/images/Python.png"
draft: true
---

Herokuでデプロイしたアプリ上で, matplotlibのグラフ描写をしようとしたところ

という問題が発生したので対処法をまとめておきます.

## エラー吐かれてそもそもデプロイできない

具体的には,

> ImportError: No module named tkinter

を吐かれて苦労しました.

解決策としては, 先にmatplotlibをインポートして, tkinter(Mac標準)ではなくAggを利用するように変更することです.

``` python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
```

あるいは,
**matpotlibrc** をカレントディレクトリに設置して,

``` txt
backend: Agg
```

と記述しておくことでも解決できます.

こちらの方法なら, import文の前に通常の命令を挟まないのでコーディング規約にも違反しませんし, 毎回記述する必要もありません.

##  グラフの日本語が文字化けする 

デフォルトのフォントが日本語対応してないのが原因みたいです.

適切なフォントをダウンロードして, matplotlib側で指定していきます.

[IPAexフォント ダウンロードページ](https://ipafont.ipa.go.jp/old/ipaexfont/download.html)より, IPAexゴシックをダウンロードして, ipaexg.ttf ファイルを製作中のHerokuのアプリフォルダ/.fonts/に移動させます.

その上で,

``` python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

fontprop = FontProperties(fname='.fonts/ipaexg.ttf', size=10)
```

としておきます.
あとは matplotlib でグラフ描写するときに

``` python
plt.xticks(<X軸リスト>, <X軸名前リスト(日本語)>, font_properties=fontprop)
```

という風に指定してあげればOKです.


で, これも **matpotlibrc** に書いてしまえばめんどくさくなくて良きです.

``` txt
backend             : Agg
font.family         : IPAexGothic
```
