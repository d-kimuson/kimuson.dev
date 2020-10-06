---
title: "Django REST frameworkのパーミッションのカスタマイズについて"
description: "Django REST frameworkでパーミッションのカスタマイズする方法について紹介します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "django"
category: "Django"
date: "2020-06-12T14:33:39+09:00"
weight: 5
draft: true
---

DRFのパーミッションカスタマイズについてのメモ.

Djangoでは, `ViewSet` にパーミッションクラスを渡すことでアクセスパーミッションに関する設定をします.

例えば, 認証済みユーザーに対してのアクセスに制限したい場合, `permissions.IsAuthenticated` クラスを用います.

``` python
from rest_framework import viewsets
from rest_framework import permissions

from .models import Sample
from .serializer import SampleSerializer


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = (permissions.IsAuthenticated, )
```

これで, 各メソッドアクセスが認証済みユーザーに制限されました.

他には標準で,

- [AllowAny](https://www.django-rest-framework.org/api-guide/permissions/#allowany)
- [IsAuthenticated](https://www.django-rest-framework.org/api-guide/permissions/#isauthenticated)
- [IsAdmin](https://www.django-rest-framework.org/api-guide/permissions/#isadminuser)
- [IsAuthenticatedOrReadOnly](https://www.django-rest-framework.org/api-guide/permissions/#isauthenticatedorreadonly)

などが用意されています.

## パーミッションクラス

パーミッションクラスには, 二種類のメソッドが定義されます.

| メソッド                                                                      | 対象        |
| :---------------------------------------------------------------------------- | :---------- |
| `has_permission(request: Request, view: Callable) -> bool`                    | 全てのView  |
| `has_object_permission(request: Request, view: Callable, obj: Model) -> bool` | Detail View |

リクエストが送られてきたときに,

まず, 対象のビュー関数に対して権限があるかを `has_permission()` メソッドでチェックし, 権限がない場合は, 401 レスポンスを返す.

続いて,

- ビュー関数が `Detail View` でない場合は, そのままビュー関数を呼ぶ
- ビュー関数が `Detail View` である場合は, 対象のオブジェクトに対して権限があるかを `has_object_permission` メソッドでチェックし, ない場合は 403 レスポンスを返す

と言った流れで権限チェックを行います.

### カスタマイズ

カスタマイズの例として, User モデルに対する権限設定を考えます.

Userモデルに対する `CRUD` 操作のうち,

- アカウント作成は, アカウントを持っていないユーザーにも提供される
- 閲覧は, 認証済みユーザーに制限される
- 更新, 削除は, 認証ユーザーが自身である場合に制限される

と言った形で権限設定をしたい場合は, 以下のように実装します.

``` python
from rest_framework import permissions


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method.lower() == 'post':
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj) -> bool:
        return obj == request.user
```

以上です.
