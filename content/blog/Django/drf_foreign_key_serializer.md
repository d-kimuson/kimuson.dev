---
title: DRFでシリアライザのForeignKeyフィールドをPOST時はプライマリーキーを渡し、GET時は展開する
description: まだ書いてない
category: Django
tags:
  - Django
  - DRF
date: "2020-10-01T22:40:32.169Z"
thumbnail: 'thumbnails/Blog.png'
draft: false
---

## やりたいこと

Django REST framework の `ModelSerializer` では, `ForeignKey` のフィールドは, シリアライズ/デシリアライズするときにネストを展開してしまいます.

例をあげますと,

``` python:title=models.py
from django.db import models
import uuid


class ForeignModel(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False
    )
    name = models.CharField(max_length=255, unique=True)


class SampleModel(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False
    )
    foreign = models.ForeignKey(ForeignModel, on_delete=models.CASCADE)
```

のようにモデル定義されているとき, GETメソッドのレスポンスは

``` json
{
    "id": "xxxxxx",
    "foreign": {
        "id": "yyyyy",
        "name": "myname"
    }
}
```

このように展開されて, POSTメソッドのパラメータは,

``` json
{
    "foreign": {
        "name": "myname"
    }
}
```

の形で指定する必要があります.

GETメソッドに関しては望ましいですが, POSTメソッドのパラメータに関しては既存のオブジェクトのプライマリーキーが欲しい場合が多いと思います.

ということで,

- GETメソッドでは, インスタンスをJSONに展開する
- POSTのパラメータでは, プライマリーキーのみを受け取る

という形でシリアライザを実装するのが主題です.

## 環境

環境は以下の通りです.

``` sh
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.6
BuildVersion:   19G2021
$ python -V
Python 3.8.5
$ pip list
Package                   Version
------------------------- ---------
Django                    3.0.5
djangorestframework       3.11.0
drf-yasg                  1.17.1
packaging                 20.4
```

## 解決策

シリアライザのフィールドには, `write_only` や `read_only` を指定ができるので, `read_only` を指定したGETメソッド用のシリアライザフィールドと, `write_only` を指定したPOSTメソッドのシリアライザフィールドを定義してあげることで, 期待する動作を実装できます.

### GETメソッドを展開して受け取る

GETメソッドの要求は元々満たしていますが, 私は, APIドキュメントの自動生成ツールである [drf_yasg](https://github.com/axnsan12/drf-yasg) を使っていて, 適切なビルドのため `MethodSerializer` にて実装します.

``` python:title=serializers.py
from rest_framework import serializers
from rest_framework.utils.serializer_helpers import ReturnDict
from drf_yasg.utils import swagger_serializer_method
from typing import Dict, Any

from .models import ForeignModel, SampleModel


class ForeignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForeignModel
        fields = ('pk', 'name')


class SampleSerializer(serializers.ModelSerializer):
    foreign = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SampleModel
        fields = ('pk', 'foreign',)

    @swagger_serializer_method(serializer_or_field=ForeignSerializer)
    def get_foreign(self, instance: SampleModel) -> ReturnDict:
        return ForeignSerializer(instance.foreign).data
```

`drf_yasg` を使っていないなら `Meta.fields` に追加して, `read_only` を指定してあげるだけで大丈夫なはずです.

### POSTパラメータには, プライマリーキーを渡す

POSTメソッド用のフィールドには `PrimaryKeyRelatedField` を使います.

`write_only` にしつつ, シリアライズメソッドを上書きすることで対応します.

``` python:title=serializers.py
from rest_framework import serializers
from rest_framework.utils.serializer_helpers import ReturnDict
from drf_yasg.utils import swagger_serializer_method
from typing import Dict, Any

from .models import ForeignModel, SampleModel


class ForeignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForeignModel
        fields = ('pk', 'name')


class SampleSerializer(serializers.ModelSerializer):
    foreign = serializers.SerializerMethodField(read_only=True)
    foreign_pk = serializers.PrimaryKeyRelatedField(
        queryset=ForeignModel.objects.all(),
        write_only=True
    )

    class Meta:
        model = SampleModel
        fields = ('pk', 'foreign', 'foreign_pk')

    @swagger_serializer_method(serializer_or_field=ForeignSerializer)
    def get_foreign(self, instance: SampleModel) -> ReturnDict:
        return ForeignSerializer(instance.foreign).data

    def create(self, validated_data: Dict[str, Any]) -> SampleModel:
        foreign_pk = validated_data.get('foreign_pk', None)

        if foreign_pk is not None:
            validated_data['foreign'] = foreign_pk
            del validated_data['foreign_pk']

        return super().create(validated_data)
```

これで,

- GETメソッド => `foreign` にインスタンス情報が展開される
- POSTメソッド => `foreign_pk` にプライマリーキーを渡す

という形になりました.

## 実際にAPIを叩いてみる

一応APIを叩いてみます. クライアントは, [HTTPie](https://httpie.org/) を使っています.

``` sh
$ http http://localhost:8080/samples/
HTTP/1.1 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Length: 249
Content-Type: application/json
Date: Thu, 01 Oct 2020 21:37:41 GMT
Server: WSGIServer/0.2 CPython/3.8.5
Vary: Accept, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

[
    {
        "foreign": {
            "name": "myname",
            "pk": "2880c984-c284-4229-a1ca-c159e418511c"
        },
        "pk": "7d97ed86-55b5-4b5a-8e9e-bc26f2badc34"
    }
]

$ http POST http://localhost:8080/samples/ foreign_pk=2880c984-c284-4229-a1ca-c159e418511c
HTTP/1.1 201 Created
Allow: GET, POST, HEAD, OPTIONS
Content-Length: 123
Content-Type: application/json
Date: Thu, 01 Oct 2020 21:40:07 GMT
Server: WSGIServer/0.2 CPython/3.8.5
Vary: Accept, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "foreign": {
        "name": "myname",
        "pk": "2880c984-c284-4229-a1ca-c159e418511c"
    },
    "pk": "5889a2f0-0195-412b-b1f0-a4a8bd9efdb9"
}
```

見ての通り, 期待通りの動作をしてくれているようです.

<!-- ソースコードの全文は [d-kimuson/drf_foreign_serializer_sample](https://github.com/d-kimuson/drf_foreign_serializer_sample) に貼ってあります. -->
