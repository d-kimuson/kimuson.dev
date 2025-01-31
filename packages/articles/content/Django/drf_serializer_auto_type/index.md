---
title: "Django REST framework でシリアライザからTypeScript型定義を自動生成する"
description: まだ書かれていません
category: "Django"
tags:
  - "Python"
  - "Django"
  - "DRF"
  - "TypeScript"
date: "2020-11-21T00:18:12Z"
thumbnail: "thumbnails/Django.png"
draft: false
---

## TL;DR

- DRF シリアライザから、OpenAPI スキーマを自動生成するよ
- OpenAPI スキーマから、TypeScript 型を自動生成するよ
- これによって、シリアライザから自動的に API の型定義ができるよ
- API 通信でも手軽に型安全に開発ができるよ

## What is OpenAPI?

> The OAS defines a standard, programming language-agnostic interface description for REST APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. When properly defined via OAS, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OAS removes guesswork in calling a service.

[FAQ - OpenAPI Initiative](https://www.openapis.org/faq) より

つまるところ、REST API の定義を

- 特定のプログラミング言語に依存しないインタフェースによって
- 人間と機械の両方に読みやすい形で

記述してあげようね、ってものです

## シリアライザから OpenAPI スキーマを生成する

Django REST framework では、シリアライザを組み合わせることで、API を定義します

シリアライザには、API レスポンスとしての情報が細かく定義されているので、このシリアライザ定義から、OpenAPI スキーマを自動生成しようという試みがあります

- [GitHub - axnsan12/drf-yasg: Automated generation of real Swagger/OpenAPI 2.0 schemas from Django REST Framework code.](https://github.com/axnsan12/drf-yasg)
- [GitHub - tfranzel/drf-spectacular: Sane and flexible OpenAPI 3 schema generation for Django REST framework.](https://github.com/tfranzel/drf-spectacular)

drf-yasg は、手軽に API ドキュメントを自動生成できるため人気です(Github スター数 19000↑)

参考: [DjangoRestFramework のコードから Swagger ドキュメントを生成し API 設計を共有 - Qiita](https://qiita.com/T0000N/items/c982fd9586763747fb11)

ただし、

> If you are looking to add Swagger/OpenAPI support to a new project you might want to take a look at drf-spectacular, which is an actively maintained new library that shares most of the goals of this project, while working with OpenAPI 3.0 schemas.
> OpenAPI 3.0 provides a lot more flexibility than 2.0 in the types of API that can be described. drf-yasg is unlikely to soon, if ever, get support for OpenAPI 3.0.

ってことで、より柔軟な API 定義ができる `OpenAPI 3.0` を使いたければ drf-spectacular がオススメだよーってことらしいので、こちらを使ってみます

触ってみましたが、基本的には drf_yasg と同じ使用感でした

## drf-spectacular を導入する

設定は至ってシンプルで、[公式のインストール](https://github.com/tfranzel/drf-spectacular#installation) 通りです

```bash
$ pip install drf-spectacular
```

```python:settings.py
INSTALLED_APPS = [
    # ALL YOUR APPS
    'drf_spectacular',
]

# ...

REST_FRAMEWORK = {
    # YOUR SETTINGS
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
```

設定はこれだけです

あとは、

```bash
$ python manage.py spectacular --file schema.yml
```

これで OpenAPI 3.0 のスキーマ定義が `schema.yml` に書き出されます

## Open API Generator

Open API のスキーマが書き出せたので、これを元に TypeScript 向けの型定義を生成します

[GitHub - OpenAPITools/openapi-generator: OpenAPI Generator allows generation of API client libraries (SDK generation), server stubs, documentation and configuration automatically given an OpenAPI Spec (v2, v3)](https://github.com/OpenAPITools/openapi-generator)

こちらを使うことで、スキーマから型定義を生成できます

インストールします

```bash
$ yarn add -D @openapitools/openapi-generator-cli
```

型生成コマンドがちょっと長いので、`package.json` に追加します

```json:package.json
{
  "scripts": {
    "openapi:gen": "openapi-generator-cli generate -g typescript-axios -i path/to/schema.yml -o ./openapi"
  },
}
```

とりあえず `typescript-axios` のジェネレータを使っていますが、もともと TS に限ったツールじゃないので多言語含めいろいろあります

他のジェネレータは [OpenAPITools/openapi-generator/docs/generators](https://github.com/OpenAPITools/openapi-generator/tree/master/docs/generators) から探せます

では、実際に生成してみます

```bash
$ yarn openapi:gen
yarn run v1.22.4
$ openapi-generator-cli generate -g typescript-axios -i path/to/schema.yml -o ./openapi
[main] INFO  o.o.codegen.DefaultGenerator - Generating with dryRun=false
...
/path/to/openapi/.openapi-generator/VERSION
✨  Done in 2.28s.

$ tree openapi
openapi
├── README.md
├── api.ts
├── base.ts
├── configuration.ts
├── git_push.sh
└── index.ts

0 directories, 6 files
```

無事生成できました

この段階では、型周りの問題がありますので修正しておきます

## AnyType is not defined

[[bug][typescript] `AnyType` is not defined · Issue #6332 · OpenAPITools/openapi-generator · GitHub](https://github.com/OpenAPITools/openapi-generator/issues/6332)

こちらの問題が安定版の `4.3.1` で起きてます、とりあえずグローバルに以下の型定義を適用します

```typescript
type AnyType = Record<string, unknown>;
```

また、型チェックオプションによっては生成されたコードには問題があることがあります

`import type` を使えとか。

この辺はとりあえず手動で修正します

## 実際に API を叩く

API を使うには、書き出された `api.ts` に定義されている

- ApiAPi
- ApiAPiFp
- ApiApiFactory

辺りを使うことができます

一番直感的に感じたので今回は `ApiApiFactory` を使います

```typescript:api.ts
import axios from "axios"

import { ApiApiFactory as getEndpoints, Configuration } from "path/to/openapi"

const api = axios.create({
  // axios configure
})

const config = new Configuration({
  // some settings
})
export const endpoints = getEndpoints(config, `http://localhost:8000`, api)
```

`endpoints` には、各 API エンドポイントに割当られた関数が定義されていて、

```typescript
import { endpoints } from "@scripts/api";

endpoints
  .apiSamplesList()
  .then((response) => {
    // 処理
  })
  .catch((error) => {
    console.log(error);
  });

endpoints
  .apiSamplesRetrieve(id)
  .then((response) => {
    // 処理
  })
  .catch((error) => {
    console.log(error);
  });
```

こんな感じで使うことができます

各エンドポイントに対応する関数には、`Open API` スキーマ基づいた型付けがされているので、型安全に API を呼ぶことができるわけです

## 型チェックの無効化

先程は、手動で型を修正しましたが、せっかくスキーマを自動生成できるのでできれば

1. API が追加/変更した
2. 自動的に **有効な** 型定義(手を加える必要のないもの)が生成される
3. API コールに関しても型チェックが働く

みたいなフローを自動化しておきたいです

何でも良いですけど、とりあえず

```bash:schema.sh
#!/bin/bash
yarn run openapi:gen

function insertTsNocheck() {
  echo '// @ts-nocheck' | cat - $1 > temp && \mv temp $1
}

cd frontend/static/openapi
insertTsNocheck api.ts
insertTsNocheck base.ts
```

とかとかで、自動的に型チェックを無効化するのが良さそうです

## メソッドシリアライザ

```json
{
  "pk": "xxx",
  "name": "sample",
  "user": {
    "pk": "yyy",
    "email": "hoge@example.com"
  }
}
```

のような外部キーを使ったリレーションをネストしたような API の場合は、基本的には型が効かない(`AnyType` になる)ので、メソッドシリアライザを使って `extend_schema_field` デコレータで装飾する必要があります

```python:serializers.py
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from typing import Any, Dict

from .models import User, Sample


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'email',)


class SampleSerializer(serializers.ModelSerializer):
    user = UserSerialzer

    class Meta:
        model = Sample
        fields = ('pk', 'name', 'user')

    @extend_schema_field(UserSerializer(many=False))
    def get_user(self, obj: User) -> Dict[str, Any]:
        return UserSerializer(instance=obj.user, many=False).data
```

以上のように、メソッドシリアライザとデコレータを使うことによってネストされた構造でも適切にスキーマ定義&型が生成されるようになります

## action デコレータによる追加エンドポイント

`ModelViewSet` 等によって定義される純粋な REST API だけで足りない場合は、`action` デコレータを使うことで追加のエンドポイントを作ったりしますが、こちらも

- 対象の関数がエンドポイントであること
- API パラメータ、レスポンス型

を `extend_schema` デコレータで drf_spectacular に教えてやる必要があります

```python:views.py
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from typing import Dict, Any

from .models import Sample
from .serializers import SampleSerializer, UserSerializer


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer

    @extend_schema(
        responses={
            200: UserSerializer
        },
        methods=['GET',],
        summary="user",
    )
    @action(methods=['GET'], detail=True, url_path='user')
    def user(self, request: Request, pk: Optional[str] = None, **kwargs: Dict[str, Any]) -> Response:
        sample = self.get_object()
        return Response(
            UserSerializer(instance=sample.user).data
        )
```

これで、`endpoints.apiSamplesUserRetrieve` にエンドポイントが追加されます

## 終わりに

drf_yasg はよく使ってたので、スキーマ作れるなら型も作れるでしょと思って調べてやってみたんですが、良い感じでした！

今回は、TypeScript 型定義の自動生成のために使いましたが、API ドキュメントの自動生成も便利なのでオススメです

[公式](https://github.com/tfranzel/drf-spectacular) にしたがって、ルーティングを追加するだけで利用できます
