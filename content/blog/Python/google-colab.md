---
title: "Google Colaboratoryを試す"
date: "2018-12-23T00:21:56+09:00"
thumbnail: "/media/images/Python.png"
tags:
  - "Python"
  - "Colaboratory"
category: "Python"
draft: true
---

## Google Colaboratoryとは

Google Colaboratoryは, Googleによって提供されるJupyter Notebookをベースに提供されるPythonの実行環境です.機械学習用を歌っていますが, もちろん通常の実行環境としても利用できます.

## Jupyter Notebookとの違い

純正のJupyter Notebookとの違いは,

Jupyter NotebookがローカルのPythonを利用するのに対して, Google ColaboratoryではGoogleの計算機を利用します.

ゆえに,

- 環境構築が一切不要
- 端末のスペックに関わらず, 演算が高速
- GPU(機械学習に適した演算能力の高いプロセッサ)を利用できる
- プログラムを実行環境ごとシェアできる(Jupyter Notebook + Github + Binder でも同様のことが可能だが, 遅くて実用性が低い)

というメリットがあります.

実行環境毎にスクリプトをシェアしたいときや, Deep Learning用に高速なGPUを利用したいときなどに重宝しそうです.

## Google Colaboratoryの起動

Google Colaboratoryの起動の仕方は,

1. Google Driveにアクセス
2. Colaboratory用のフォルダを作成
3. アプリを追加でColaboratoryを選択しColabと連携

という感じで,
[Google Colabの知っておくべき使い方](https://www.codexa.net/how-to-use-google-colaboratory/)
で画像つきで手順が紹介されていたのでわかりやすかったです.

軽く使ってみた感想としては,

- 機械学習レベルならともかく普通の処理は, (通信の遅延分)Jupyterのが速い
- 機械学習用の標準的なライブラリは揃っているが, 自由度が低い(当然だけど)
- Markdownのプレビューはありがたい

て感じです.

## Google Drive上のファイルをPythonで扱うためのTips

最低限, Google Drive上のファイルは読み書きはできないとしんどいのでそのやり方だけメモっておきます.

まずは, Google Driveをマウント(ツリー構造の認識)をしていきます.

``` python
from google.colab import drive
drive.mount('/content/gdrive')
```

実行すると, リンクと入力フォームが表示されます.
リンクを踏んで進むと, 認証コードが表示されるのでそれをコピって入力フォームへ貼り付けてあげると認証が完了して, 通常のファイルを操作するようにGoogle Drive内のフォルダやファイルにアクセスできるようになります.

Linuxコマンドは!をつけると使えるという話だったんですが,

1. !付きだと動作しないコマンド
1. !なしだと認識されないコマンド
1. どっちでも動作するコマンド

の３種類があり, 1と3がほとんどで, 2がレアケースだったので, !なしで実行してみて認識されなかったら!つけてやってみる感じで良さそうです.

Google Driveのルートディレクトリには,

``` python
cd /content/gdrive/'My Drive'/
```

で移動できます.

予めアップロードしておいたファイルを読み込むことも可能ですし, touchなどで生成したtxtファイルにwith openで書き込みをするようなことも可能でした.これである程度満足行く操作ができそうです.

**参考**

``` python
cd /content/gdrive/'My Drive'/
!touch hogehoge.txt

path = "/content/gdrive/'My Drive'/hogehoge.txt"

with open( path, "w" ) as f:
    f.write( "Hello World!" )

cat hogehoge.txt
```

で, 出力が

``` bash
Hello World!
```

また実際に使い道ができたときに詳しく触ってみたいと思います.
