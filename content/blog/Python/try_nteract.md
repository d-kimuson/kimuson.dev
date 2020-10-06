---
title: "Nteractを試す"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Jupyter"
category: "Python"
date: "2019-06-20T13:34:54+09:00"
draft: true
---

NteractなるJupyter環境があるとのことで少し気になったので触ってみます.

## 準備

``` bash
$ pip install nteract_on_jupyter
$ pip install ipykernel
$ python -m ipykernel install --user
```

Web版とデスクトップ版があり, Web版はJupyter Nobebookのような感じで, デスクトップ版は [Nteract](https://nteract.io/) からダウンロードできます.

## Web版Nteractを使ってみる

Jupyte Notebookと同様に,

``` bash
$ jupyter nteract
```

で起動できます.

![Web版NetractUI](/media/images/web_nteract.png)

UIはこんな感じでNotebookよりGoogle Colabに近い気がします.

Shift+Enterで実行など基本操作も同じです.

当然, matplotlibのプロット図表示や, pandas.Dataframeのデーブル表示もできます.

コーディング補完等の機能は当然エディタ類には及びませんが, Notebookと比べると強力でした.

## デスクトップ版Nteractを使ってみる

[Nteract](https://nteract.io/)
からダウンロードして起動します.

![デスクトップ版NetractUI](/media/images/desktop_nteract.png)

UIもWeb版と完全に一緒なので特に書くことがない()

ただFile, Edit等のタブがないので機能面でやや劣るって感じ.

## Data Explorerの利用

Notebookとの最大の違いはData Explorerなるものの存在で,

``` python
import pandas as pd

pd.options.display.html.table_schema = True
pd.options.display.max_rows = None
```

と記述しておくと, pandas.Dataframeに対して簡単に様々なビジュアライズを行うことができます.


### 通常のテーブル

![Netract_Table](/media/images/nteract_table.png)

各テーブルのサイズも変更できますし, 省略せずに全てのデータを表示できます.

**Show Filter** から値の検索もできます.

![Netract_FIlter](/media/images/nteract_filter.png)

こんな感じ.

### 棒グラフ

![Netract_g1](/media/images/nteract_graph1.png)

### 折れ線グラフ

![Netract_g2](/media/images/nteract_graph2.png)

ボタン1つで, 簡単にデータの可視化ができるので
データ・アナリティクス
的な用途でPythonを使う場合にはかなり良い環境の選択肢になると思います.

Deep Learningとかするときは使ってみようかな.
