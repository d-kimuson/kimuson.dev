---
title: "[PyQt + QtDesigner] Python で GUIアプリ開発 その2 ~ 主なウィジェットの使い方 ~"
description: "PyQtの主要なウィジェットを紹介します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "PyQt"
category: "Python"
date: "2019-06-22T17:53:17+09:00"
draft: false
---

今回の記事は,

[[PyQt + QtDesigner] Python で GUI アプリ開発 その 1 ~ 開発の流れ ~](../pyqt1/)

の続きです.

PyQt で GUI アプリを開発する上での主要なウィジェットメソッドについてまとめます.

主要なウィジェットに定義されたメソッドを見ていきます.

## QLabel

文字列を表示するだけのよくあるラベルです.

- QLabel.setText("hoge"): テキストをセット
- QLabel.text(): セットされているテキストを取得

## QLineEdit

前回も使った, 1 行の文字列入力を受け取るウィジェットです.

- QLineEdit.setText("hoge"): テキストをセット
- QLineEdit.text(): セットされたテキストを取得
- QLineEdit.setPlaceholderText("hoge"): プレースホルダーを設定
- QLineEdit.returnPressed.connect(**Function**): return されたときの処理
- QLineEdit.setReadOnly(True/False): 読み取り専用, True なら値を編集できない
- QLineEdit.setFocus(): 複数の lineEdit がある場合などに, Focus しておくとどこに入力を求めているのかがわかりやすい.

文字列のセット, 取得等の他に,

reuturn されたときのイベントや, プレースホルダー等も指定できます.

### サンプルコード

```python
from PyQt5 import QtWidgets, uic

ui_path = "ui_files"
dlg = uic.loadUi(f"{ui_path}/page1.ui)"
# dlg1には, Label, lineEdit1, lineEdit2が設置されているとします.


def changeLabel():               # lineEdit1でreturnされた時の処理
    text = dlg.lineEdit1.text()  # lineEdit1にセットされたテキストを取得
    dlg.Label.setText(text)      # Labelに取得したテキストをセット
    dlg.lineEdit2.setFocus()     # lineEdit1の入力を終えたのでlineEdit2を強調


dlg.lineEdit1.setPlaceholderText("なにか入力して下さい")
dlg.lineEdit1.setFocus()  # 初期段階でlineEdit1を強調しておく
dlg.lineEdit1.returnPressed.connect(changeLabel)  # lineEdit1でreturnされた時に呼ぶ関数を, changeLabel() に指定

if __name__ == "__main__":
    dlg.show()
    app.exec()
```

このコードでは,

1. lineEdit1 が Focus(入力待ち感), プレースホルダーで｢なにか入力して下さい｣
2. lineEdit1 に適当に文字列を入力して Return
3. changeLabel()が呼び出され, Label のテキストが入力されたテキストに置き換わり, lineEdit2 が Focus(入力待ち感)

という動作を実装しています.

## QpushButton

前回も使った通常のボタンです.

- pushButton.clicked.connect(**Function**)
- pushButton.setText("hoge"): テキストをセット
- pushButton.text(): セットされているテキストを取得

## QListWidget

複数のアイテムをリスト上に並べるウィジェットです.

- QListWidge.addItem("hoge") : 要素を追加
- QListWidget.insertItem(row, "hoge"): row に要素を挿入
- QListWidget.item(row) : Row の要素の取得
- QListWidget.currentRow(): 選択されている Row 番号
- QListWidget.currentItem(): 選択されている要素を取得
- QListWidget.setCurrentItem(QListWidgeItem("hoge")): 選択している位置に要素を追加

行番号を指定して, アイテムを追加/取得, あるいは選択されている行を対象にアイテムを追加/取得するようなメソッドが定義されています.

注意点として, QListWidge の要素は, 全て QListWidgeItem クラスインスタンスであるということがあげられます.

value を得るには, 取得した要素.text() をする必要があります.

## QTableWidget

QTabelWidget では, テーブル上にアイテムを並べて表示します.

1 次元のリストである QListWidge に対して, テーブルは 2 次元です.

- QTableWidget.setRowCount(row_length) : row の長さ指定
- QTableWidget.setColumnCount(column_length): column の長さ指定
- QTableWidget.setItem(row, column, QTableWidgetItem("hoge")) : 要素の追加
- QTableWidget.item(row, column) : 要素の取得
- QTableWidget.currentRow(): 選択されている Row 番号
- QTableWidget.currentColumn(): 選択されている Column 番号
- QTableWidget.currentItem(): 選択されている要素を取得
- QTableWidget.setCurrentItem(QTableWidgetItem("hoge")) : 選択されているセルに要素を追加

`QListWidge` と同様に, 要素は `QTableWidgeItem` クラスのインスタンスなので取得した要素を得るには, `要素.text()` をする必要があります.

基本的には, QListWidge と似た操作ですが, 2 次元なのでセルを指定したければ当然 2 つの添字を渡す必要があります.

## その他のウィジェット

PyQt では, その他にもたくさんのウィジェットを利用できます.

`Qt Designer` の `Widget Box` から設置できるのでいろいろ見てみると良いかも.

あまり細かいものまでみても仕方ないので今回は省略しますが, 使いたいウィジェットがあったときには, 公式の

[Qt Widgets C++ Classes](https://doc.qt.io/qt-5/qtwidgets-module.html)

から各ウィジェットに定義されたメソッドとパラメータを見ることができます.

C++版のドキュメントですが, 定義されているメソッドは基本的に全部同じなので, このドキュメントを参考にすれば十分ウィジェットを扱えるはずです.

また, Python 版の情報は検索してもあまりヒットしないので, 英語で検索して海外の資料を参考にするか, PyQt ではなく Qt として検索して情報収集することをおすすめします.

今回は終わります, ありがとうございました.

## PyQt + Qt Designer で GUI アプリ開発

`PyQt` 関係は 3 エントリに分けて投稿してます.

よろしければ他もどうぞ.

今回は主なウィジェットの使い方について紹介しました.
次回は, 汎用的な画面遷移の実装についてです.

1. [[PyQt + QtDesigner] Python で GUI アプリ開発 その 1 ~ 開発の流れ ~](./../pyqt1/)
1. [[PyQt + QtDesigner] Python で GUI アプリ開発 その 2 ~ 主なウィジェットの使い方 ~](./../pyqt2/)
1. **[[PyQt + QtDesigner] Python で GUI アプリ開発 その 3 ~ \*.connect() に引数ごと関数を渡す方法と, 汎用的画面遷移の実装 ~](./../pyqt3/)**

次回は, \*.connect() に引数もセットで関数を渡す方法と, それを利用した汎用的な画面遷移関数を実装します.
