---
title: "ESM で実行する ts-node で paths のエイリアスを解決する"
description: "ts-node で ESM を実行するときに tsconfig-paths が使えないので繋ぎをする loader を書く"
category: "TypeScript"
tags:
  - TypeScript
date: "2021-09-18T23:20:23Z"
thumbnail: "thumbnails/TypeScript.png"
draft: false
---

## TLDR;

- TypeScript で書いてトランスパイルしたものを node に ESM で読ませたい
  - commonjs にすればって感じだけど、使いたいライブラリが dual package 対応してなかったり、top level await が使いたくて、とかで ESM で実行したいときもある
- 1 ファイル実行するのに全部トランスパイルするのはアレなので、ts-node や esbuild-register で実行したい
  - ts-node: (experimental ではあるけど) ESM の実行はできる。ただ tsconfig-paths/register が使えない
  - esbuild-register: 未対応 ([set "type": "module" in `package.json` breaks the build · Issue #26 · egoist/esbuild-register](https://github.com/egoist/esbuild-register/issues/26))
- という感じで少なくとも現時点で「paths のエイリアスを解決しながら TypeScript を ESM 向けにトランスパイルして実行する」手段がなさそうなので、実行できるようにする

## 作る

esbuild-register でやるか、ts-node でやるか。

両方ざっと眺めてみたけど、esbuild-register ではそもそも ESM の実行自体できないので、そこから手を入れる必要があってめんどくさそうだった

ts-node なら loader を上書きしてエイリアスさえ読めるようにしてやれば実行できるのでこっちでやる

ts-node だと、ESM は

```bash
node --loader ts-node/esm ./src/hello.ts
```

で実行する。で、この `ts-node/esm` の実態が `node_modules/ts-node/esm.mjs` にある

```ts:node_modules/ts-node/esm.mjs
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(fileURLToPath(import.meta.url))

/** @type {import('./dist/esm')} */
const esm = require('./dist/esm')
export const {
  resolve,
  getFormat,
  transformSource,
} = esm.registerAndCreateEsmHooks()
```

nodejs の loader については公式ドキュメントを参照

[Modules: ECMAScript modules \| Node.js v16.9.1 Documentation](https://nodejs.org/api/esm.html#esm_loaders)

今回の用途なら ts-node の resolve を呼ぶ前に paths のエイリアス解決をしてから渡してやれば良いはずなのでエイリアス解決を書く

エイリアスの解決には [tsconfig-paths](https://github.com/dividab/tsconfig-paths) を使う

```bash
yarn add -D tsconfig-paths typescript ts-node
```

で、実際に書いた loader が以下。

```ts:loader.js
import path from 'path'
import typescript from 'typescript'
import { createMatchPath } from 'tsconfig-paths'
import { resolve as BaseResolve, getFormat, transformSource } from 'ts-node/esm'

const { readConfigFile, parseJsonConfigFileContent, sys } = typescript

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const configFile = readConfigFile('./tsconfig.json', sys.readFile)
if (typeof configFile.error !== 'undefined') {
  throw new Error(`Failed to load tsconfig: ${configFile.error}`)
}

const { options } = parseJsonConfigFileContent(
  configFile.config,
  {
    fileExists: sys.fileExists,
    readFile: sys.readFile,
    readDirectory: sys.readDirectory,
    useCaseSensitiveFileNames: true,
  },
  __dirname
)

export { getFormat, transformSource }  // こいつらはそのまま使ってほしいので re-export する

const matchPath = createMatchPath(options.baseUrl, options.paths)

export async function resolve(specifier, context, defaultResolve) {
  const matchedSpecifier = matchPath(specifier)
  return BaseResolve(  // ts-node/esm の resolve に tsconfig-paths で解決したパスを渡す
    matchedSpecifier ? `${matchedSpecifier}.ts` : specifier,
    context,
    defaultResolve
  )
}
```

完成。tsconfig-paths と ts-node/esm を繋いでやってるだけ。

これで、エイリアス使って import してる TypeScript ファイルを実行してみる

```bash
$ yarn ts ./src/hello.ts
yarn run v1.22.10
$ node --loader ./loader.js ./src/hello.ts
(node:1871) ExperimentalWarning: --experimental-loader is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
$ echo hello! hoge
hello! hoge
✨  Done in 2.16s
```

問題なし。

## おまけ

ちなみに、ts-node はトランスパイラに swc を指定できるようになったので、esbuild じゃないと遅くてやってられないよというなら差し替えることもできる

[Third-party transpilers \| ts-node](https://typestrong.org/ts-node/docs/transpilers/)

```bash
yarn add -D @swc/core @swc/helpers
```

swc をいれつつ、tsconfig.json に設定をかませる

```json:tsconfig.json
{
  // ...
  "ts-node": {
    "transpileOnly": true,
    "transpiler": "ts-node/transpilers/swc-experimental"
  }
}
```

これで、さっきと同じスクリプトを実行してみる

```bash
$ yarn ts ./src/hello.ts
yarn run v1.22.10
$ node --loader ./loader.js ./src/hello.ts
(node:1987) ExperimentalWarning: --experimental-loader is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
$ echo hello! hoge
hello! hoge
✨  Done in 0.53s.
```

2.16 秒かかっていた処理が 0.53 秒で終わる
