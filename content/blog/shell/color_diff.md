---
title: "Text Diffを見やすくする"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Shell"
category: "shell"
date: "2020-06-16T15:01:10+09:00"
weight: 5
draft: true
---

`diff` コマンドが見づらい問題を解消する.

bash 標準の diff はだいぶ見づらい.

``` bash
$ diff file1 file2
2c2
< hello world2
---
> hello world
```

一応差分はわかるけど, ソースコードの全体像もはっきりしないしわかりにくい.

## colordiff の導入

`diff` をカラーリングできる `colordiff` の導入.

``` bash
$ brew install colordiff
```

`shell` の設定ファイルにて, `colordiff` に `diff` のエイリアスをつけておく.

``` bash
if [[ -x `which colordiff` ]]; then
    alias diff='colordiff'
fi
```

これでカラーリングされるようになった.

## Git Like な Diff

`-u` オプションで `Git` っぽい見た目で差分が見られる.

``` bash
$ diff -u file1 file2
```

## 横並びで比較

`-y` オプションで, 横並びで比較できるのでとてもみやすい.

併用できるオプションとして,

- `--left-column`: 左側は全表示, 右側は差分表示に
- `--suppress-common-lines`: 差分だけ表示

があるけど, 個人的には `--left-column` が使いやすかった.

``` bash
$ diff diff -y --left-column file1 file2
```

## エイリアス

最後にエイリアスを貼っておく.

``` bash
alias diffy='diff -y --left-column'
alias diffg='diff -u'
```

以上.
