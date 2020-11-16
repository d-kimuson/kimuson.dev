---
title: "Django Rest Framework まとめ"
description: "Django REST frameworkについて説明します。"
thumbnail: "/thumbnails/Django.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2020-05-24T05:44:53+09:00"
weight: 10
draft: true
---

DRFを何度か使ったので, ざっくりまとめておく.

Django自体の機構には触れない.

[リポジトリ](https://github.com/kaito1002/drf-tutorial).

## 環境

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.4
BuildVersion:   19E287
$ python -V
Python 3.7.2
$ pip -V
pip 20.0.2 from /Users/kaito/.pyenv/versions/3.7.2/lib/python3.7/site-packages/pip (python 3.7)
$ pip list | grep pipenv
pipenv                 2018.11.26 
```

パッケージ管理には, `pipenv`, 静的解析ツールとして `mypy` を使うようにする.

## 導入

``` bash
# Mypy
$ pipenv install --dev mypy

# Django
$ pipenv install django
$ pipenv install --dev django-stubs ipython django-extensions

# Django Rest Framework
$ pipenv install djangorestframework
$ pipenv install --dev djangorestframework-stubs
```

初期設定 `config/settings.py` を上書き.

``` python:config/settings.py
# config/settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'sample.apps.SampleConfig',  # 今回使うアプリ
]
```

`mypy` 用設定ファイルの設置.

``` ini:mypy.ini
; mypy.ini
[mypy]
python_version = 3.7

check_untyped_defs = True
disallow_untyped_defs = True
disallow_any_generics = True
disallow_untyped_calls = False
disallow_untyped_decorators = False

ignore_errors = False
ignore_missing_imports = False

strict_optional = True
no_implicit_optional = True

implicit_reexport = False

strict_equality = True
warn_unused_ignores = True
warn_redundant_casts = True
warn_unused_configs = True
warn_unreachable = True
warn_no_return = True

; Django support
plugins =
  mypy_django_plugin.main

[mypy.plugins.django-stubs]
django_settings_module = config.settings

[mypy-django.core.asgi]
ignore_missing_imports = True

[mypy-*.migrations.*]
ignore_errors = True

[mypy-*.tests.*]
ignore_errors = True
```

## シリアライザ

REST APIにおいては, Client <=> Server 間で, JSON形式でデータがやりとりされる.

言い換えれば, クライアントサイドで扱うJSON形式のデータとPythonオブジェクトとしてのインスタンスが双方向に変換できる必要がある, ということ.

具体的には, 例えば

``` python:sample/models.py
# sample/models.py
from django.db import models
from django.core.validators import MinLengthValidator


class SampleModel(models.Model):
    name = models.CharField(
        max_length=20,
        validators=[MinLengthValidator(1)],
        null=False
    )

    def __repr__(self) -> str:
        return "SampleModel({})".format(self.name)

    __str__ = __repr__
```

このようなモデルが定義されているとき,

``` python
instance = SampleModel.objects.create(name="tarou")
```

``` json
{
  "pk": 1,
  "name": "tarou"
}
```

これらが等しいレコードを表していて,

`GET` メソッドにおいて `instance` => `JSON`,

`POST`, `PUT`, `PATCH`, `DELETE` メソッドにおいて, `JSON` から インスタンスの操作ができる必要があるということだ.

これを担っているのがシリアライザの概念で, 一般的に`seriazers.py` に記述していく.

### シリアライザの例

基本的には汎用的なシリアライザを使うが, まずはベーシックなものから.

``` python:sample/serialzers.py
# sample/serialzers.py
from rest_framework import serializers

from .models import SampleModel


class SampleSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=20,
        min_length=1,
        allow_blank=False,
        trim_whitespace=True
    )

    def create(self, validated_data: Dict[str, str]) -> SampleModel:
        created = SampleModel.objects.create(**validated_data)
        if isinstance(created, SampleModel):
            return created
        else:
            # ここには到達しない
            # 型付けのため
            raise RuntimeError
        
    def update(self, instance: SampleModel, validated_data: Dict[str, str]):
        for key in validated_data.keys():
            instance.__setattr__(key, validated_data.get('name'))

        instance.save()
        return instance

    def to_representation(self, instance) -> Dict[str, str]:
        return super().to_representation(instance)
```

- create: dict から新規オブジェクトの作成
- update: dict から既存オブジェクトのパラメータ更新
- to_representation: インスタンス => dict への変換

を担っている.

### シリアライズ(instance => dict)

`シリアライザ.data` を参照する

``` python
import json
from sample.serialzers import SampleSerializer
from sample.models import SampleModel

tarou = SampleModel.objects.create(name='tarou')
SampleSerializer(instance=tarou).data                 # {'name': 'jiro'}

# 内部的には,
SampleSerializer().to_representation(instance=tarou)  # OrderedDict([('name', 'jiro')])
```

dataへの変換は, `to_representation` が担っているのでカスタマイズしたい場合はここをいじる, 実際に外から使うときは `.data` を参照する.

これで, インスタンスからDictへの変換ができた.


### デシリアライズ1 (dict => instance 新規作成)

``` python
import json
from sample.serialzers import SampleSerializer

json_data = '{"name": "jiro"}'
dict_data = json.loads(json_data)

serializer = SampleSerializer(data=dict_data)
serializer.is_valid()      # True
serializer.validated_data  # OrderedDict([('name', 'jiro')])
serializer.save()          # SampleModel(jiro)
```

jsonから読みこんだディクショナリを

1. シリアライザのコンストラクタに渡す
2. is_valid() でバリデーション
    1. True なら save() でオブジェクト作成
    1. False ならエラー処理を.


### デシリアライズ2 (dict => instance パラメータ更新)

``` python
import json
from sample.serialzers import SampleSerializer

tarou = SampleModel.objects.get(name='tarou')
serializer = SampleSerializer(instance=tarou, data={"name": "updated_tarou"})
serializer.is_valid()  # True
serializer.save()      # SampleModel(updated_tarou)
```

コンストラクタに, インスタンスとdata両方を渡しているときは save() において update() が呼ばれる.

まとめると,

| 用途           | コンストラクタ引数            | 補足                                   |
| :------------- | :---------------------------- | :------------------------------------- |
| シリアライズ   | インスタンス                  | .data にDictが入る                     |
| 新規作成       | ディクショナリ                | .save(中でcreateが呼ばれる) で新規作成 |
| パラメータ更新 | インスタンス & ディクショナリ | .save(中でupdateが呼ばれる) で更新     |

こんな感じ.

partial_update したいときには, コンストラクタに `partial=True` を渡す.

参考: [Serializers #Partial updates - Django REST framework](https://www.django-rest-framework.org/api-guide/serializers/#partial-updates)

### ModelSerializer

ほとんどのコードは共通なので抽象化された ModelSerializer を継承して差分を書くほうが効率的だ.

``` python:sample/serializers.py
# sample/serializers.py
from rest_framework import serializers
from .models import SampleModel


class SampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleModel
        fields = ('pk', 'name',)
        extra_kwargs = {
            'name': {}  # Dictで渡す
        }
```

extra_kwargs にオプションを指定することで細かなカスタマイズができる.

実際に使えるオプションは以下参照.

[Serializer fields #Core arguments - Django REST framework](https://www.django-rest-framework.org/api-guide/fields/#core-arguments)


## ビューセット

DRFにおいて, view は viewset で定義する

### django-filter の導入

ビューでクエリによるフィルタリング(?name=tarouとか)を可能にするパッケージを追加しておく

``` bash
$ pipenv install django-filter
```

``` python:config/settings.py
# config/settings.py
INSTALLED_APPS = [
    ...
    'django_filters',
    ...
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ],
}
```

これでフィルタリングのデフォルトを指定したので, 各ビューで明示しなくてもクエリによるフィルタリングを使うことができるようになった.

### ModelViewSet

``` python:sample/views.py
from rest_framework import viewsets

from .models import SampleModel
from .serializers import SampleModelSerializer


class SampleModelViewSet(viewsets.ModelViewSet):
    queryset = SampleModel.objects.all()
    serializer_class = SampleModelSerializer
    filter_fields = ('name', )
```

ModelViewSet に, queryset と serializer_class を指定することで, CRUDを扱うビューが自動生成される.

カスタマイズについては,

| アクション               | メソッド                                                               |
| :----------------------- | :--------------------------------------------------------------------- |
| 動的な query_set の指定  | get_queryset(self) -> QuerySet                                         |
| 動的な serializer の指定 | get_serializer_class(self) -> Type\[serializers.BaseSerializer]        |
| GET 一覧                 | list(self, request, *args, \**kwargs) -> Response                      |
| GET 詳細                 | retrieve(self, request, *args, \**kwargs) -> Response                  |
| POST 新規作成            | create(self, request: Request, *args: Any, \**kwargs: Any) -> Response |
| PUT 更新                 | update(self, request, *args, \**kwargs) -> Response                    |
| PATCH 部分更新           | partial_update(self, request, *args, \**kwargs) -> Response            |
| DELETED 削除             | destroy(self, request, *args, \**kwargs) -> Response                   |

この辺りを書き換えることで, 細かな調整が可能だ.

他にも, CRUD操作のうちRead Onlyなビューを自動生成する [Viewsets #ReadOnlyViewSet - Django REST framework](https://www.django-rest-framework.org/api-guide/viewsets/#readonlymodelviewset) もある.

### ルーティング

アプリケーション下の `urls.py` に下のように記述する

``` python:sample/urls.py
# sample/urls.py
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('sample', views.SampleModelViewSet)

urlpatterns = []
urlpatterns += router.urls
```

あとは, project の `urls.py` にて,

``` python:config/urls.py
# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('sample.urls')),
]
```

のようにすれば良い.

## トークン認証の追加

トークン認証については, 以前記事を書いたのでそちらのリンクを貼っておく.

[Django Rest Frameworkでトークン認証](/post/server_side/django_token_auth/)

## APIドキュメントの自動生成

DRFには, シリアライザ定義を参照することでAPIドキュメントを自動生成できる [axnsan12/drf-yasg - github](https://github.com/axnsan12/drf-yasg) がある.

### drf-yasg の導入

``` bash
$ pipenv install drf-yasg
$ pipenv install --dev drf-yasg-stubs
```

### セットアップ

``` python:title=config/settings.py
# config/settings.py
INSTALLED_APPS = [
    ...
    'drf_yasg',
    ...
]
```

``` python:title=sample/urls.py
# sample/urls.py
from django.urls import path
from rest_framework import routers
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from . import views

app_name = 'sample'

router = routers.DefaultRouter()
# Endpoint Config
router.register('sample', views.SampleModelViewSet)
urlpatterns = []
urlpatterns += router.urls

# Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Sample API",
        default_version='v1',
        description="Sample Api",
        terms_of_service="https://example.com",
        contact=openapi.Contact(email="mail.kaito03@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    # ⇓ 型定義では, Tuple[str] 求めてるのに, 実行してみるとパーミッションクラスを必要としてる ⇓
    # ⇓ とりあえず, 無視しておく ⇓
    permission_classes=(AllowAny,),  # type: ignore
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
```

``` ini:title=mypy.ini
; mypy.ini
plugins =
  mypy_django_plugin.main, mypy_drf_plugin.main

...

; Ignore Package Imports
[mypy-ruamel.*]
ignore_missing_imports = True
```

これで,

- [/redoc](http://127.0.0.1:8000/redoc)
- [/swagger](http://127.0.0.1:8000/swagger)

にAPIドキュメントが自動生成されるようになった.

シリアライザをきちんと定義しておけば, ドキュメントも適切に定義される.

`@action` デコレータでエンドポイントを追加した場合は,

``` python
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class SampleModelViewSet(viewsets.ModelViewSet):
    queryset = SampleModel.objects.all()
    serializer_class = SampleModelSerializer
    filter_fields = ('name', )

    @action(['GET'], detail=False, permission_classes=(permissions.IsAuthenticated,))
    @swagger_auto_schema(
        request_body=SampleModelSerializer,
        responses={
            200: openapi.Response('成功.', SampleModelSerializer),
            401: openapi.Response('Bad Request.')
        }
    )
    def additional_endpoint(self, request: Request) -> Response:
        return Response(data={}, status=status.HTTP_200_OK)
```

このように, swagger_auto_schema デコレータを介して Request Body や レスポンスに対してシリアライザを指定できる.
