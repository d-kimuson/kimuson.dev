---
title: "dotfiles を chezmoi + nix home-manager に載せ替えた"
thumbnail: "thumbnails/インフラ.png"
tags:
  - "chezmoi"
  - "nix"
  - "home-manager"
  - "dotfiles"
category: "インフラ"
date: "2026-02-14T00:00:00+09:00"
weight: 5
draft: false
---

ずっとシンボリックリンクで管理していた dotfiles を捨てて chezmoi + home-manager に乗り換えたのでメモ

## Why

- 最近 Claude code, Codex, Copilot CLI 等 OS に直で入れるツールが増えてきており管理しやすくインストールする手段が欲しくなってきていた
- npm から入れろって言ってきがちなんだけど、mise とかで管理しているとプロジェクトによって使っている Node.js, npm の実態が違うので見つからないとかの問題を踏みがち
  - 必要になるたびに入れ直しとかは面倒でやりたくない
- 自前でやるために必要以上に複雑になっている感があったので...

## 各ツールの責務

- chezmoi:
  - 設定ファイル(~/.zshrc, ...etc)をリポジトリ管理するツール
  - `~/.local/share/chezmoi` 以下に `dot_zshrc` みたいなファイルが作成され、`chezmoi apply` するとこれが `~/.zshrc` に配られるという仕組みで設定ファイルを管理できる
- home-manager
  - Nixでグローバルに追加するツールを管理できる
  - Nix で宣言したツールが `home-manager switch` するだけで入る
  - 基本的には OS 跨ぐことが可能で Mac で設定したものをそのまま Ubuntu とかに持っていって `home-manager switch` するだけで宣言した依存がちゃんと入る

という感じなので、手動でインストールをしなきゃいけないのはこの2つだけになり、新しいマシンを利用する際は

1. chezmoi を入れる & apply する
2. config が諸々降ってくる(→home-manager の config も利用可能に)
3. nix & home-manager を入れる
4. `home-manager switch` する

で終わり。あとは別マシンで使っていたのとほぼ同じ環境が動く。

## セットアップを楽にする

新しいマシンでのセットアップを極力楽にしたいので、dotfiles リポジトリにセットアップスクリプトを置いた

新しいマシンでは

```bash
bash -c "$(curl -fsLS https://raw.githubusercontent.com/d-kimuson/dotfiles/refs/heads/main/scripts/setup.sh)"
```

のように叩くだけで、chezmoi, nix, nix 経由で諸々のツールがインストールされ、セットアップが終わる！楽！

nix の環境再現性が高いのでこういうのがまともに動くようになった

## chezmoi の同期をサブディレクトリにする

初見の chezmoi で結構嫌だったのが `~/.local/share/chezmoi` に `dot_zshrc` のような同期ファイルが置かれてこれを丸ごとコミットしろという設計

同期しないファイルでリポジトリに起きたいものもある (CLAUDE.md, README.md, .github, ...etc)

で、簡単に調べた感じだとこれを上手く扱う(つまり同期するファイル以外を置く)手段は2つ用意されており

1. `.chezmoiignore` をおいて `.github` 等を指定していく
2. `.chezmoiroot` をおいてサブディレクトリ名を記載する

1 だと漏れもあるし認知面でも分かりづらさが残るので、2を使うことにした。

結果、今のディレクトリ構造がこんな感じ:

```bash
➜ tree . --depth 2
 .
├── AGENTS.md
├── chezmoi
│   ├── dot_claude
│   ├── dot_codex
│   ├── dot_copilot
│   ├── dot_gitconfig
│   ├── dot_gitignore_global
│   ├── dot_super-agent
│   ├── dot_zshrc.tmpl
│   ├── private_dot_config
│   └── private_dot_ssh
├── CLAUDE.md
├── config
│   ├── modular-mcp.example.json
│   ├── modular-mcp.json
│   └── starship.toml
├── README.md
├── scripts
│   ├── reload.sh
│   ├── setup.sh
│   └── setup_mcps.sh
└── shell
    ├── alias.sh
    ├── localrc.sh
    └── sharedrc.sh
```

これで

- システムに同期されるファイル群は chezmoi 以下
- それ以外は同期せずに使うもの

という形でわかりやすくなった

## Node.js のバージョン固定は引き続き mise でやる

Node.js 本体も Nix Flakes やその代替(devbox, devenv, ...etc)等を使ってプロジェクトごとに管理するのも良いなーと思っていたけどやめて Nix 経由で mise を入れて使ってる

理由:

- Nix Flakes で Node.js のバージョンを固定することが難しい
  - Nix Flakes が得意なのはあくまで `nix develop` した環境間の差分を極力なくすことであり、バージョンを固定することではない
  - 例えばプロジェクトで Node.js v22.14.0 を使ってますとなったときに Nix で揃えるには v22.14.0 がちょうどコミットされているコミットハッシュを見つけてきてそれを設定に書かないといけない
- Nix Flakes の「PATH 環境変数を上手く設定することで依存を固定する」という仕組みが direnv とセットで8割型のケースでは問題ないんだけど、たまに開発用のツールと噛み合わせが悪い
  - 問題なのはグローバルで普通起動するでしょってツール系。VSCode とか、手前味噌だけど自分が作っている claude-code-viewer とか
  - `PATH=/nix/store/...` を direnv で設定するから利用する依存がロックされるので、VSCode 等を別で立てると起動時の環境変数と当然使われるし、開いたプロジェクトごとに切り替えるような仕組みもない(実現も難しいんじゃないかな)、ということ

この辺りがあるので、言語ランタイムの固定は引き続き mise を使っとくのがちょうど良いなと思っている

ちなみに mise もデフォルトだと nix に近い PATH 書き換えのアプローチを取っているので同じ問題があり、shims 板(`--shims`) を私は使ってる

Node.js 完結のプロジェクトだと他の依存ってないことも多くてその場合は mise のみで良いし、他のインストールされていないといけない依存がある場合は nix flakes 使うとバチっとハマって良い

## nixpkgs は unstable と master を切り替える

nix ではパッケージの取得元をブランチで指定することになる

よく使われるブランチは

- stable (stable というブランチではなくバージョニングされたリリースブランチ)
- unstable
- master

があるらしい

unstable って命名的にちょっと気が引けるが調べるとみんな unstable を使うみたいなので私も基本 unstable を使っている

ただし、少し気になる点はあり unstable が最新のバージョンからちょい遅れがちなこと。unstable でも master からテストを経て数日遅れて入るらしい。

数日の遅れなんであまり気にならないんだけど、Coding Agent 系のツールは結構流れ早いのでできるだけ最新が使いたいことも多く、切り替えできるようにして使ってる

```nix:~/.local/share/chezmoi/chezmoi/private_dot_config/home-manager/flake.nix.tmpl
{
  description = "...";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-master.url = "github:NixOS/nixpkgs/master";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { nixpkgs, nixpkgs-master, home-manager, ... }:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      pkgsMaster = import nixpkgs-master {
        inherit system;
        config.allowUnfree = true;
      };
    in
    {
      homeConfigurations."{{ .chezmoi.username }}" = home-manager.lib.homeManagerConfiguration {
        inherit pkgs;
        extraSpecialArgs = {
          pkgsMaster = pkgsMaster;
        };

        # Specify your home configuration modules here, for example,
        # the path to your home.nix.
        modules = [ ./home.nix ];

        # Optionally use extraSpecialArgs
        # to pass through arguments to home.nix
      };
    };
}
```

```nix:~/.local/share/chezmoi/chezmoi/private_dot_config/home-manager/home.nix.tmpl
{ config, pkgs, pkgsMaster, ... }:

{
  home.username = "{{ .chezmoi.username }}";
  home.homeDirectory = "{{ .chezmoi.homeDir }}";
  home.stateVersion = "25.11"; # Please read the comment before changing.

  home.packages = [
    # 開発環境で使うツール
    pkgs.mise
    pkgs.direnv
    pkgs.starship
    pkgs.colima
    pkgs.docker
    pkgs.docker-compose
    pkgs.bun
    pkgs.pnpm

    # Language Servers
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.typescript

    # AI
    pkgsMaster.claude-code
    pkgsMaster.codex
    pkgsMaster.github-copilot-cli

    # 準標準
    pkgs.jq
    pkgs.lsof
    pkgs.net-tools
    pkgs.nano
    pkgs.unzip
    pkgs.wget
    pkgs.dasel

    # 標準コマンドの代替(高速・多機能)
    pkgs.fd
    pkgs.eza
    pkgs.lsd
    pkgs.ripgrep
    pkgs.bat
    pkgs.colordiff

    # 標準コマンドのGNU版統一
    pkgs.coreutils-full
    pkgs.diffutils
    pkgs.findutils
    pkgs.gnused
    pkgs.gnugrep
    pkgs.gawk
    pkgs.gnutar
  ];

  nixpkgs.config.allowUnfree = true; # Allow unfree packages

  programs.home-manager.enable = true; # Let Home Manager install and manage itself.
}
```

home.nix で指定する際に最新を使いたいものは `pkgsMaster.claude-code` で指定することで新しいバージョンが入りやすくなる

とはいえこれでも多少遅れるので本当に一切遅れたくないなら nix 使わないしかなさそう

## 終わり

ちょい不満っぽい部分も書きましたが総合的にかなり満足してます

- 前の構成ではなんだかんだ新しいマシンの初期設定は結構大変だったのがスクリプト叩くだけに
- 依存がコード管理できるので新しく使いたくなったら claude code 開いて「〜使いたいんだけど」って言ったら別のマシン含めて使える状態になる
- chezmoi の template 機能が便利なので、共通化しづらかった箇所(user 名が入ったり home directory が入ったり)も管理対象に雑に突っ込める

リポジトリはこれ:

https://github.com/d-kimuson/dotfiles
