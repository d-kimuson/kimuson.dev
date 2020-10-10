---
title: "MarkdownからHTMLやPDFを生成するコメンドを作った"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Markdown"
category: "product"
date: "2018-12-07T15:29:02+09:00"
weight: 5
draft: true
---

記述が楽で, CSSを適当すれば見た目的にもいい感じのメモやノートが作れるのでMarkdownを好んでよく使うんですが,



共有するときなどに, HTMLやPDFにさくっと変換したいと感じることが多々あるので, 変換ツールを取得してスクリプト化しました.

- [Markdownとは](#markdownとは)
- [準備](#準備)
- [スクリプト化](#スクリプト化)
  - [MarkdownからHTMLを生成](#markdownからhtmlを生成)
  - [MarkdownからPDFを生成](#markdownからpdfを生成)

## Markdownとは

端的に言えば, HTMLを超簡易的に書ける記法です.

![スクリーンショット](/media/images/markdown.png)

こんな感じで簡単に構造化された文章を書くことができます.

具体的な記法については触れませんが, 僕の場合はこのブログも Markdown で書いていますし, それ以外にもメモやドキュメント作成など用途の幅は広いです.

## 準備

Python3系が必要なので, 無い場合は [公式ページ](https://www.python.org/) よりインストール.

まずは, Homebrewよりpandocをインストールします.

``` bash
$ brew install pandoc
```

また,
[lualatex-ja](https://ja.osdn.net/projects/luatex-ja/wiki/LuaTeX-ja%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9#h2-.E3.82.A4.E3.83.B3.E3.82.B9.E3.83.88.E3.83.BC.E3.83.AB.E3.83.BB.E3.82.A2.E3.83.83.E3.83.97.E3.83.87.E3.83.BC.E3.83.88.E6.96.B9.E6.B3.95)
もインストールしておきます.

プレーンなHTMLでは味気がないので, githubのデザインに寄せた
[github.css](https://github.com/sindresorhus/github-markdown-css)
を使わせて頂き(MIT Licenseにて配布されています),

pandocでテンプレートとして扱えるHTMLに変換し
[github.html](https://github.com/kaito1002/wrap_github_html/blob/master/github.html)
として使います.

他のcssを用いたり, 自分でスタイルを設定したい場合は,

``` bash
$ pandoc -D > hoge.html
```

とすれば最小構成のテンプレートが生成されます.

中身は基本htmlなので, 最低限の知識があればデザインを変更できるはずです.

## スクリプト化

Markdown を HTML形式に変換する **md2html** と,
PDF形式に変換する **md2pdf** を書いていきます.

### MarkdownからHTMLを生成

``` bash
#!/bin/sh

function md2html () {
    # Sample Usage: md2html sample.md
    MD=$1
    HTML=${1/.md/.html}
    touch $HTML
    pandoc -f markdown $MD -t html5 --template=/path/to/github.html --metadata pagetitle="initial title" -o $HTML
    CURRENT_PATH=`pwd`
    echo $CURRENT_PATH"/"$HTML" に書き出したよ"
}
```

### MarkdownからPDFを生成

``` bash
#!/bin/sh

md2pdf () {
    # Sample Usage: md2pdf sample.md
    MD=$1
    PDF=${1/.md/.pdf}
    pandoc $MD -o $PDF -V documentclass=ltjarticle --pdf-engine=lualatex
    CURRENT_PATH=`pwd`
    echo "OPEN by 'open "$CURRENT_PATH"/"$PDF"'"
}
```

``` bash
$ md2html test.md
/path/to/test.html に書き出したよ
$ md2pdf test.md
OPEN by 'open /path/to/test.pdf'
```

という感じで手軽に変換できます.
