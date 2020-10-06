---
title: "[PyQt + QtDesigner] Python で GUIアプリ開発 その2 ~ 主なウィジェットの使い方 ~"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "PyQt"
category: "Python"
date: "2019-06-22T17:53:17+09:00"
draft: true
---

今回の記事は,

[[PyQt + QtDesigner] Python で GUIアプリ開発 その1  ~ 開発の流れ ~](/post/pyqt1/)

の続きです.

PyQtでGUIアプリを開発する上での主要なウィジェットメソッドについてまとめます.

主要なウィジェットに定義されたメソッドを見ていきます.

## QLabel

文字列を表示するだけのよくあるラベルです.

- QLabel.setText("hoge"): テキストをセット
- QLabel.text(): セットされているテキストを取得

## QLineEdit

前回も使った, 1行の文字列入力を受け取るウィジェットです.

- QLineEdit.setText("hoge"): テキストをセット
- QLineEdit.text(): セットされたテキストを取得
- QLineEdit.setPlaceholderText("hoge"): プレースホルダーを設定
- QLineEdit.returnPressed.connect(**Function**): returnされたときの処理
- QLineEdit.setReadOnly(True/False): 読み取り専用, Trueなら値を編集できない
- QLineEdit.setFocus(): 複数のlineEditがある場合などに, Focusしておくとどこに入力を求めているのかがわかりやすい.

文字列のセット, 取得等の他に,

reuturnされたときのイベントや, プレースホルダー等も指定できます.

### サンプルコード

``` python
from PyQt5 import QtWidgets, uic

ui_path = "ui_files"
dlg = uic.loadUi(f"{ui_path}/page1.ui)"
# dlg1には, Label, lineEdit1, lineEdit2が設置されているとします.


def changeLabel():  # lineEdit1でreturnされた時の処理
    text = dlg.lineEdit1.text()  # lineEdit1にセットされたテキストを取得
    dlg.Label.setText(text)  # Labelに取得したテキストをセット
    dlg.lineEdit2.setFocus()  # lineEdit1の入力を終えたのでlineEdit2を強調

dlg.lineEdit1.setPlaceholderText("なにか入力して下さい")
dlg.lineEdit1.setFocus()  # 初期段階でlineEdit1を強調しておく
dlg.lineEdit1.returnPressed.connect(changeLabel)  # lineEdit1でreturnされた時に呼ぶ関数を, changeLabel() に指定

if __name__ == "__main__":
    dlg.show()
    app.exec()
```

このコードでは,

1. lineEdit1がFocus(入力待ち感), プレースホルダーで｢なにか入力して下さい｣
2. lineEdit1に適当に文字列を入力してReturn
3. changeLabel()が呼び出され, Labelのテキストが入力されたテキストに置き換わり, lineEdit2がFocus(入力待ち感)

という動作を実装しています.

<a id="qpushbutton"></a>
## QpushButton

前回も使った通常のボタンです.

- pushButton.clicked.connect(**Function**)
- pushButton.setText("hoge"): テキストをセット
- pushButton.text(): セットされているテキストを取得

## QListWidget

複数のアイテムをリスト上に並べるウィジェットです.

- QListWidge.addItem("hoge") : 要素を追加
- QListWidget.insertItem(row, "hoge"): rowに要素を挿入
- QListWidget.item(row) : Rowの要素の取得
- QListWidget.currentRow(): 選択されているRow番号
- QListWidget.currentItem(): 選択されている要素を取得
- QListWidget.setCurrentItem(QListWidgeItem("hoge")): 選択している位置に要素を追加

行番号を指定して, アイテムを追加/取得, あるいは選択されている行を対象にアイテムを追加/取得するようなメソッドが定義されています.

注意点として, QListWidgeの要素は, 全て QListWidgeItemクラスインスタンスであるということがあげられます.

valueを得る得るには, 取得した要素.text() をする必要があります.

## QTableWidget

QTabelWidgetでは, テーブル上にアイテムを並べて表示します.

1次元のリストであるQListWidgeに対して, テーブルは2次元です.

- QTableWidget.setRowCount(row_length) : rowの長さ指定
- QTableWidget.setColumnCount(column_length): columnの長さ指定
- QTableWidget.setItem(row, column, QTableWidgetItem("hoge")) : 要素の追加
- QTableWidget.item(row, column) : 要素の取得
- QTableWidget.currentRow(): 選択されているRow番号
- QTableWidget.currentColumn(): 選択されているColumn番号
- QTableWidget.currentItem(): 選択されている要素を取得
- QTableWidget.setCurrentItem(QTableWidgetItem("hoge")) : 選択されているセルに要素を追加

QListWidge同様に, 要素は, QTableWidgeItemクラスインスタンスなので, 取得した要素を得るには, 要素.text() をする必要があります.

基本的には, QListWidgeと似た操作ですが, 2次元なのでセルを指定したければ当然2つの添字を渡す必要があります.

## その他のウィジェット

PyQtでは, その他にもたくさんのウィジェットを利用することができます(Qt DesignerのWidget Boxから設置できるのでいろいろ見てみると良いかも).

あまり細かいものまでみても仕方ないので今回は省略しますが, 使いたいウィジェットがあったときには, 公式の

[Qt Widgets C++ Classes](https://doc.qt.io/qt-5/qtwidgets-module.html)

から各ウィジェットに定義されたメソッドとパラメータを見ることができます.

C++版のドキュメントですが, 定義されているメソッドは基本的に全部同じなので, このドキュメントを参考にすれば十分ウィジェットを扱えるはずです.

また, Python版の情報は検索してもあまりヒットしないので, 英語で検索して海外の資料を参考にするか, PyQtではなくQtとして検索して情報収集することをおすすめします.

今回は終わります, 閲覧ありがとうございました.

---

### PyQt + Qt DesignerでGUIアプリ開発

1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その1  ~ 開発の流れ ~](/post/pyqt1/)
1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その2 ~ 主なウィジェットの使い方 ~](/post/pyqt2/)
1. [[PyQt + QtDesigner] Python で GUIアプリ開発 その3 ~ *.connect() に引数ごと関数を渡す方法と, 汎用的画面遷移の実装 ~](/post/pyqt3/) ←次はここ

次回は, *.connect() に引数もセットで関数を渡す方法と, それを利用した汎用的画面遷移関数を実装します.
