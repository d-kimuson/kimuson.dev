# Gatsby Tech Blog

## Codegen

GraphQL スキーマに変更があれば,

``` bash
$ yarn codegen
```

で型定義ファイルが
[types/graphql-types.d.ts](./types/graphql-types.d.ts)
に自動生成される

`onSave` で走らせたければ, 開発サーバーを

``` bash
$ yarn dev:codegen
```

で建てる.

ただ, 重いので非推奨 ┐(´д｀)┌ﾔﾚﾔﾚ
