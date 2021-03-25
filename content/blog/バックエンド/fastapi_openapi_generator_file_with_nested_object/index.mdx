---
title: "FastAPI の OpenAPI スキーマから openapi-generator でファイルとネストされたリクエストボディを受け取るエンドポイントの型が定義されない問題への対処法"
description: "FastAPIのOpenAPIスキーマからopenapi-generatorでファイルとネストされたリクエストボディを受け取るときに発生する、型が定義されない問題へ対処する方法を紹介します。"
category: "バックエンド"
tags:
  - FastAPI
date: "2021-01-03T06:39:04Z"
thumbnail: "thumbnails/Python.png"
draft: false
---

## 前提

[FastAPI](https://fastapi.tiangolo.com/ja/) では、開発サーバーの `/openapi.json` から OpenAPI スキーマが提供されます

このスキーマから、[openapi-generator](https://github.com/OpenAPITools/openapi-generator) で TypeScript コードを生成します

私の場合は、[typescript-axios ジェネレータ](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/typescript-axios.md) を使っています

### 環境

```bash
$ pip freeze | grep fastapi
fastapi==0.62.0

$ yarn list | grep openapi
├─ @openapitools/openapi-generator-cli@2.1.16
```

## 問題

`multipart/form-data` でファイルとネストされたリクエストボディを同時に受け取るエンドポイントにて、適切に型定義が生成されません

例として、以下の `endpoint1`

```python:server.py
from fastapi import FastAPI, UploadFile, File
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel

app = FastAPI()


class Arg1(BaseModel):
    hoge: string


@app.post("/endpoint1/")
async def endpoint1(body: Arg1, file: UploadFile = File(...)) -> Dict[str, Any]:
    # ...


class Arg2(BaseModel):
    huga: string


@app.post("/endpoint2/")
async def endpoint2(body: Arg2) -> Dict[str, Any]:
    # ...
```

スキーマとしては、以下(多少簡略化してます)

```json:schema.json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Sample API",
    "version": "0.0.0"
  },
  "paths": {
    "/endpoint1/": {
      "post": {
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/schema1"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "sample endpoint",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    },
    "/endpoint2/": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/arg2"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "sample endpoint 2",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "schema1": {
        "title": "Schema1",
        "required": [
          "arg",
          "file"
        ],
        "type": "object",
        "properties": {
          "arg": {
            "$ref": "#/components/schemas/arg1"
          },
          "file": {
            "title": "File",
            "type": "string",
            "format": "binary"
          }
        }
      },
      "arg1": {
        "title": "Arg1",
        "type": "object",
        "properties": {
          "hoge": {
            "type": "string"
          }
        }
      },
      "arg2": {
        "title": "Arg2",
        "type": "object",
        "properties": {
          "huga": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

このスキーマから、以下のコマンドで型定義を生成します

```bash
$ openapi-generator-cli generate -g typescript-axios -i http://127.0.0.1:5000/schema.json -o ./openapi
```

で、以下のように生成されます (`Arg2` は生成されていますが、`Arg1` が生成されていないのがわかります)

```typescript:openapi/api.ts
// いろいろ省略

/**
 *
 * @export
 * @interface Arg2
 */
export interface Arg2 {
    /**
     *
     * @type {string}
     * @memberof Arg2
     */
    huga?: string;
}

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     *
     * @param {Arg2} [arg2]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public endpoint2Post(arg2?: Arg2, options?: any) {
        return DefaultApiFp(this.configuration).endpoint2Post(arg2, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {Arg1} arg
     * @param {any} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public endpoint1Post(arg: Arg1, file: any, options?: any) {
        return DefaultApiFp(this.configuration).endpoint1Post(arg, file, options).then((request) => request(this.axios, this.basePath));
    }
}
```

`typescript-fetch` とか、多言語のジェネレータもいくつか試してみましたが、同じ問題がありました

## 解決策

とりあえず公式のイシューを覗いてみて

[spring rest multipart - combine file and json object · Issue #327 · OpenAPITools/openapi-generator · GitHub](https://github.com/OpenAPITools/openapi-generator/issues/327)

この辺りが同じ問題っぽかったですけど、特に解決に取り組まれてる様子もないので、現時点ではこちらで対応する必要がありそうでした

解決策としては、

1. `multipart/form-data` がダメなだけなので、別のエンドポイントを用意してそちらの引数に指定することで生成する
2. `--dry-run` で実行すると、一応差分が残るみたいなので `Arg1` を自前で書く
3. グローバル型宣言に `Arg1` を自前で書く

辺りが考えれらます

後者 2 つは `FastAPI` 側での変更に伴って型宣言を手動で書き換えなくてはならないので、1 を採用します

```python:server.py
from pydantic import BaseModel


class AdditinalSchema(BaseModel):
    arg1: Arg1


@app.post("/additional_schema/")
async def additional_schema(body: AdditinalSchema) -> None:
    raise RuntimeError('Do no call this endpoint')
```

こんな感じで適当なエンドポイントを用意して、`AdditionalSchema` のプロパティに追加していけば型定義が生成されてそのまま使うことができます
