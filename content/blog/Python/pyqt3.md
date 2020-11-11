---
title: "[PyQt + QtDesigner] Python で GUIアプリ開発 その3 ~ *.connect() に引数ごと関数を渡す方法と, 汎用的画面遷移の実装 ~"
description: "PyQtで画面遷移を実装する方法を紹介します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "PyQt"
category: "Python"
date: "2019-06-22T17:53:20+09:00"
draft: false
---

今回の記事は,

- [[PyQt + QtDesigner] Python で GUIアプリ開発 その1 ~ 開発の流れ ~](../pyqt1/)
- [[PyQt + QtDesigner] Python で GUIアプリ開発 その2 ~ 主なウィジェットの使い方 ~](../pyqt2/)

の続きです.

## *.connect() に 引数のある関数を渡す

例えば, dlg1 -> dlg2への画面遷移を実装した関数 chageView(dlg1, dlg2) を定義して,

button.buttonClicked.connect() に渡したいとします.

``` python
def changeView(dlg1, dlg2):
    pass  # 処理は省略


dlg1.button.buttonClicked.connect(changeView(dlg1, dlg2))
```

しかしこれでは, changeView(dlg1, dlg2)をその場で実行して戻り値を渡そうとしてしまうので当然うまく行きません.

引数が渡せないと, 例えば複数の画面から構成されるアプリケーションでは全ての遷移に対応する関数を個別に定義しなくてはならないので, かなり非効率的です.

これを解消するには, 標準の functools パッケージを用いて以下のように書くことで対応できます.

``` python
from PyQt5 import QtWidgets, uic
from functools import partial


def changeView(view1, view2):
    pass  # 処理は省略

app = QtWidgets.QApplication([])
ui_path = resource_path("ui_files")
dlg1 = uic.loadUi(f"{ui_path}/page1.ui")
dlg2 = uic.loadUi(f"{ui_path}/page2.ui")


dlg1.pushButton.clicked.connect(partial(changeView, view1=dlg1, view2=dlg2))
```

functools.partial() は 引数を部分適用した function を生成する関数です.

これを利用することによって, 引数を指定した状態の function を渡すことができます.

## 画面遷移の実装

[[PyQt + QtDesigner] Python で GUIアプリ開発 その1  ~ 開発の流れ ~](/post/pyqt1/)

でも簡単な画面遷移を実装しましたが, ユーザーが画面サイズを変えたり窓の位置を変更したりすると不自然な挙動をする不完全な画面遷移だったので, 適切に作り変えます.

具体的には, 位置情報とサイズを取得して遷移後のダイアログを適切な位置に移動, サイズ変更してから画面を遷移させます.

``` python
def changeView(view1, view2):
    position = view1.pos()  # 遷移前のdlgの座標を取得
    size = view1.size()  # 遷移前のサイズを取得
    view2.move(position.x(), position.y())  # 同じ位置へ
    view2.resize(size)  # 同じサイズへ
    # 画面の位置が完全に重なる
    view2.show()  # 遷移後のダイアログを表示
    view1.hide()  # 遷移前のダイアログを非表示


dlg1.button.buttonClicked.connect(partial(changeView, view1=dlg1, view2=dlg2))
```

前回の例では, view1を先に非表示にしましたが, マシンスペックによっては不自然(一時的に画面が消える)に感じてしまう可能性があるので, 先に次の画面を表示してから非表示化しています.

このchangeView関数なら, 引数に指定したダイアログからダイアログへの遷移を, 自然な形で実装できているはずです.

PyQtの記事はひとまずこれで終わろうと思います.

まともなアプリを作ろうと思えば他に, 値の永続化(.jsonやDB導入)をしたりする必要も有ると思いますが, PyQtに限ったことではないので触れません.

閲覧ありがとうございました❗

---

### PyQt + Qt DesignerでGUIアプリ開発

1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その1  ~ 開発の流れ ~](./../pyqt1/)
1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その2 ~ 主なウィジェットの使い方 ~](./../pyqt2/)
1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その3 ~ *.connect() に引数ごと関数を渡す方法と, 汎用的画面遷移の実装 ~](./../pyqt3/)
