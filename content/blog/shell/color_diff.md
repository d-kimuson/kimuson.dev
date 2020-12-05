---
title: "diff コマンドを見やすくする"
thumbnail: "/thumbnails/shell.png"
category: "shell"
date: "2020-06-16T15:01:10+09:00"
weight: 5
draft: false
---

## TL;DR

Mac 標準の diff コマンドが見づらいので、見やすくするメモ。

標準の diff コマンドは、

``` bash
$ diff file1 file2
2c2
< hello world2
---
> hello world
```

こんな感じで、一応差分はわかるけど見にくいので、みやすくします

## 環境

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.7
BuildVersion:   19H2

$ diff -v
diff (GNU diffutils) 2.8.1
Copyright (C) 2002 Free Software Foundation, Inc.

This program comes with NO WARRANTY, to the extent permitted by law.
You may redistribute copies of this program
under the terms of the GNU General Public License.
For more information about these matters, see the file named COPYING.

Written by Paul Eggert, Mike Haertel, David Hayes,
Richard Stallman, and Len Tower.
```

## colordiff の導入

`diff` をカラーリングできる [colordiff](https://www.colordiff.org/) を brew から導入します

``` bash
$ brew install colordiff
```

`.zshrc` にエイリアスを貼って `diff` で呼ばれるようにします

``` bash
if [[ -x `which colordiff` ]]; then
    alias diff='colordiff'
fi
```

これでカラーリングされるようになりました

## Git っぽい diff を表示する

色付けがされただけでもだいぶ見やすくなったんですが、`-u` オプションを付けると `git diff` っぽい見た目で差分を表示できます

``` bash
$ diff -u file1 file2
--- file1	YYYY-MM-DD hh:mm:ss.000000000 +0900
+++ file2	YYYY-MM-DD hh:mm:ss.000000000 +0900
@@ -1,2 +1,2 @@
 hello world
-hello world1
+hello world2
```

うん、見慣れた感じでとても見やすい

## 横並びで比較する

`-y` オプションで、横並びで比較できます

併用できるオプションとして、

- `--left-column`: 左側は全表示、右側は差分表示に
- `--suppress-common-lines`: 差分だけ表示

があります

``` bash
$ diff -y file1 file2
hello world                                                     hello world
hello world1                                                  | hello world2

$ diff -y --left-column file1 file2
hello world                                                   (
hello world1                                                  | hello world2

$ diff -y --suppress-common-lines file1 file2
hello world1                                                  | hello world2
```

どれもみやすいですね

この中なら、`--left-column` が良さそう

## エイリアス

オプション付きだと長くて普段使いしにくいので、エイリアスを貼っておきます

``` bash
alias diffg='diff -u'
alias diffy='diff -y --left-column'
```

以上になります
