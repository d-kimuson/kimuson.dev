---
title: "Python プロジェクトで npm-scripts を使う"
description: node以外のときもnpm-scriptsとかツールチェーンは使いたい
category: "Python"
tags:
  - Python
date: "2022-04-03T18:13:43Z"
thumbnail: "thumbnails/Python.png"
draft: false
---

Python のプロジェクト管理？に npm-scripts 使うとまあ良い感じじゃんてなったので備忘録

## モチベーション

最近めっきり Python 書かなくなったけど、機械学習をちょっとやりたくなって触ってた

パッケージマネージャの poetry がタスクランナー機能持ってなくて、なんか追加するとかしないとかいってたのでどうなってるんかなってみてみたら

[Poetry の scripts はタスクランナー機能ではない \| I Was Perfect](https://tech.515hikaru.net/post/2020-02-25-poetry-scripts/)

てことで、タスクランナーとして使うものではないらしい

で

- prettier, lintstaged, husky 辺りの言語関係なく使用したいツールチェーンを利用できる
- タスクランナーとして Makefile とか pipenv 併用するなら別に npm-scripts でも良くない？

みたいなこと思って環境作ったらまあまあ良かったのでメモ書いてる

## 環境構築は yarn install だけで良い

環境セットアップめんどくさくなりそうだけど、npm-scripts の prepare で poetry install とか噛ませられるので

```json:package.json
{
  "scripts": {
    "prepare": "poetry install"
  }
}
```

を準備して、 `yarn install` だけしてもらえば良い

## リンターを npm-scripts にまとめる

Python のリンター・フォーマッターだと未だに black, flake8 辺りが強そうなので

- `*.py` のリント -> flake8
- `*.py` のフォーマット → black
- その他諸々のファイルのフォーマット(js, json, yaml, toml) → prettier

て感じでやった

```bash
$ yarn add -D npm-run-all prettier
```

```json:package.json
{
  "scripts": {
    "lint": "run-s lint:*",
    "lint:flake8": "poetry run flake8 --show-source --config ./pyproject.toml src",
    "lint:black": "poetry run black --check src",
    "lint:prettier": "prettier './**/*.{js,ts,json,md,toml,yaml}' --check",
    "fix": "run-s fix:*",
    "fix:prettier": "prettier './**/*.{js,ts,json,md,toml,yaml}' --write",
    "fix:black": "poetry run black src"
  }
}
```

## husky のセットアップも yarn install で完結する

```bash
$ yarn add -D husky
```

```json:package.json
{
  "scripts": {
    "prepare": "run-s prepare:*",
    "prepare:husky": "husky install",
    "prepare:poetry": "poetry install",
    "prepare:gitconf": "git config core.ignorecase false && git config --global --add merge.ff false"
  }
}
```

共用したい git 設定も自動で設定できる

## lint-staged

lint-staged も使えるので設定していく

prettier は普通の node と同様に使って、`*.py` の差分ファイルを black と flake8 にかけてやる

```bash
$ yarn add -D lint-staged
```

```js:.lintstagedrc.js
module.exports = {
  'src/**/*.py': ['poetry run flake8', 'poetry run black'],
  '**/*.{js,ts,json,md,toml,yaml}': ['prettier --write'],
}
```

これで `no-verify` しない限りはコミットされたファイルはリンターとフォーマッター通貨してることが保証できる

## まとめ

```json:package.json
{
  "scripts": {
    "r": "poetry run python",
    "typecheck": "poetry run mypy --config-file ./mypy.ini src",
    "lint": "run-s lint:*",
    "lint:flake8": "poetry run flake8 --show-source --config ./pyproject.toml src",
    "lint:black": "poetry run black --check src",
    "lint:prettier": "prettier './**/*.{js,ts,json,md,toml,yaml}' --check",
    "fix": "run-s fix:*",
    "fix:prettier": "prettier './**/*.{js,ts,json,md,toml,yaml}' --write",
    "fix:black": "poetry run black src",
    "prepare": "run-s prepare:*",
    "prepare:husky": "husky install",
    "prepare:poetry": "poetry install",
    "prepare:gitconf": "git config core.ignorecase false && git config --global --add merge.ff false"
  }
}
```

Python プロジェクトなのに node 依存もつの気持ち悪いけど、そもそもタスクランナーはかけてるし、prettier, lintstaged, husky 辺りは Node 関係なくあると嬉しいので結構良かった気がする
