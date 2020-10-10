---
title: "自作シェルスクリプトで楽をしよう"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "Shell"
category: "shell"
date: "2020-02-23T00:35:38+09:00"
weight: 5
draft: true
---

自作コマンドの設置環境を新しくしたので, メモしておきます.

bashでは, **alias** や **function** を使うことでよく使うコマンドやコマンドを連ねた一連の操作に自分用の名前をつけておくことができます.

``` bash
$ alias greet="echo 'Hello World'"
$ function print_f () { echo $1 }
$ greet
Hello World
$ print_f "Hello"
Hello
```

この例では, 起動中のシェルで設定しただけなので新たに立ち上げたシェルでは使えませんが, 
**~/.bash_profile** に追加しておけば, シェルの起動時に自動でこれらのエイリアスが設定されることになります.

高頻度に使うコマンドに短い名前をつけておけば効率的ですし, 長めのコマンドはググって使うたびに設定しておけば再度調べる手間が省けます.

### alias と function の使い分け
基本は alias を使いますが, 引数を取ったり, 条件分岐をしたり, ユーザーの入力を受け取ったりとちょっとでもプログラムっぽいことを書きたければ function を使うことになります.

## ファイル分割で管理しやすくする

一応, alias やら function やらを全て **~/.bash_profile** に追加しても問題なく自作コマンドとして使えますが, 過去自分が追加したエイリアスを忘れてしまうし, 量が増えてくるとまともに管理できなくなってしまうのでファイル分割をできるようにしてあげます.

### ~/.bash_profile

``` bash
#!/bin/bash

if [ -f ~/.commandsrc ]; then
  source ~/.commandsrc
fi
```

**.bash_profile** からエントリーポイントになる **.commandsrc** (名前は何でも良い) を呼ぶようにしてあげて,

### ~/.commandsrc

``` bash
#!/bin/bash

for file in `\find ~/.commands -type f | grep '.sh' | grep -v '.git'`; do
  chmod a+x ${file}
  source ${file}
done
```

これで, シェルの起動時に **~/.commands** ディレクトリに配置された任意の **.sh** ファイルを読み込み, そこに書かれた **alias** や **function** が設定されるようになります.

あとは, 例えば  ~/.commands/python.sh のように, わかりやすく名付けをしたスクリプトを用意してあげて, この中に alias や function を適時書いてあげれば良いです.

⇓ こんな感じ ⇓

``` bash
$ tree ~
~
├── .bash_profile
├── .commandsrc
├── .commands
│   └── main.sh
│   ├── git.sh
│   ├── python.sh
...
```

## alias と function 確認用コマンドを書く

一応, 設定している **alias** の一覧は, 

``` bash
$ alias
1='cd +1'
2='cd +2'
3='cd +3'
...
```

のように取得できますが,
せっかくファイル分けしているのでファイル毎の alias や function を確認できるコマンドを書いてあげます(確認できないと, せっかく書いても使わずに埋もれてしまうので...)

**~/.commads/command.sh**

``` bash
#!/bin/bash

function cls() {
  if [ -z "$1" ]; then
    ls ~/.commands | grep ".sh" | sed s/"\.sh"//g
  else
    find ~/.commands -type f -name $1".sh"
    find ~/.commands -type f -name $1".sh" | xargs cat | grep 'alias' | grep -v "cat"
    find ~/.commands -type f -name $1".sh" | xargs cat | grep 'function' | awk '{print $1, $2}' | grep -v "cat"
  fi
}
```

これで,

- cls → ~/.commands 以下に存在する .sh ファイルの一覧
- cls hoge → ~/.commands/hoge.sh で定義されている alias と function の一覧

が取得できます.

``` bash
$ cls
command
docker
git
github
python
$ cls python
/Users/user/.commands/python.sh
alias dj='python manage.py'
function py()
```

ちなみに, whichコマンドで function の中身を確認できたりします.

``` bash
$ which py
py () {
  mypy $1 && python $1
}
```

## エイリアスを複数のマシンで共有する

複数のマシンを使う場合は, **~/.commands** ディレクトリ自体を Github の管理下に置くことでエイリアスを共有できて便利です.

``` bash
$ cd ~
$ git clone <url> .commands
```

あとは, ~/.bash_profile, ~/.commandsrc を準備してあげれば, pullするたびに最新のエイリアスに更新されることになります.

これでだいぶ管理しやすい感じでかけるようになったと思います.
