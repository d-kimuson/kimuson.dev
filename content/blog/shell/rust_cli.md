---
title: "Rust 製コマンドでターミナルを使いやすくしよう"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Shell"
category: "shell"
date: "2020-06-02T09:08:03+09:00"
weight: 5
draft: true
---

Rust 製コマンドラインツールでターミナルを使いやすくしていきます.

## 環境

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.4
BuildVersion:   19E287
```

## ls の代替

- [GitHub - Peltoche/lsd: The next gen ls command](https://github.com/Peltoche/lsd)
- [GitHub - ogham/exa: A modern version of ‘ls’.](https://github.com/ogham/exa)

これらを使います.

``` bash
$ brew install lsd exa
```

`lsd` では, デフォルトでファイル/ディレクトリの左側にアイコンをつけてくれるので見やすいです.

ただ適切にアイコンを表示するためには指定のフォントをインストールして, ターミナル用のフォントに設定しておく必要があります.

``` bash
$ brew tap homebrew/cask-fonts
$ brew cask install font-hack-nerd-font
```

あとは, 使っているターミナルアプリの設定からフォントを `Hack Bold Nerd Font` に変更してあげます.

これで使えるようになったので, エイリアスをつけてあげます.

``` bash
# ~/.bashrc

alias ls='lsd'
alias ll='exa -abghHliS'
alias tree='lsd --tree'
```

`tree` コマンドも lsd の tree オプションで上書きしておくと日本語ファイル名をきちんとエンコードしてくれたり, アイコンがついたりとみやすいです.

## cat の代替

``` bash
$ brew install bat
```

`bat` では pager として less がデフォルトで採用されているので, デフォルトの `cat` と動作を揃えたいので, pager を上書きします.

``` bash
alias cat='bat --pager ""'
```

less の挙動で使いたいときは, 普通に `bat` を使います.

## find, ps, grep

``` bash
$ brew install fd procs ripgrep
```

``` bash
alias find='fd'
alias ps='procs'
alias grep='rg'
```

## デフォルトの挙動で使いたい時

`grep` とか, `find` とかは通常のと挙動が若干違かったりするので, 上書きしないほうがいいかも.

問題があったときだけバックスラッシュつけて対応しても良いかもです.

``` bash
$ ls | \grep hoge
```
