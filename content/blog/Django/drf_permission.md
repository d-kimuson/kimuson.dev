---
title: "Django REST frameworkのパーミッションのカスタマイズについて"
description: "Django REST frameworkでパーミッションのカスタマイズする方法について紹介します。"
thumbnail: "/thumbnails/Django.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2020-11-20T11:01:32Z"
weight: 5
draft: false
---

## TLDR;

Django REST framework で、ビューへのパーミッションをカスタマイズする方法についてです。

## DRF のパーミッション

Djangoでは、 `ViewSet` にパーミッションクラスを渡すことでアクセスパーミッションに関する設定をすることができます

例えば、認証済みユーザーに対してのアクセスに制限したい場合は、`permissions.IsAuthenticated` クラスを用います

``` python:views.py
from rest_framework import viewsets
from rest_framework import permissions

from .models import Sample
from .serializer import SampleSerializer


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = (permissions.IsAuthenticated, )
```

これで、各HTTPメソッドからのアクセスが認証済みユーザーに制限されました

他には標準で,

- [AllowAny](https://www.django-rest-framework.org/api-guide/permissions/#allowany): だれでも
- [IsAuthenticated](https://www.django-rest-framework.org/api-guide/permissions/#isauthenticated)
- [IsAdmin](https://www.django-rest-framework.org/api-guide/permissions/#isadminuser): 管理者アカウントのみ
- [IsAuthenticatedOrReadOnly](https://www.django-rest-framework.org/api-guide/permissions/#isauthenticatedorreadonly): GETメソッドはだれでもOKだけど、それ以外は認証が必要

などが用意されています

## パーミッションクラス

パーミッションクラスには、二種類のメソッドが必要です

| メソッド                                                                      | 対象        |
| :---------------------------------------------------------------------------- | :---------- |
| `has_permission(request: Request, view: Callable) -> bool`                    | 全てのView  |
| `has_object_permission(request: Request, view: Callable, obj: Model) -> bool` | Detail View |

流れとしては、

1. リクエストが送られてくる
2. 対象のビュー関数に対して、`has_permission()` メソッドをコールして、権限の有無を確認
    - ない場合 => `401`
3. Detail View が対象なら `has_object_permission()` メソッドをコールして、対象のオブジェクトに対して権限があるかを確認
    - ない場合 => `403`
4. レスポンスを返す！

って感じです

## カスタマイズする

組み込みのもので要件を満たせない場合は、上記の

- `has_permission()`
- `has_object_permission()`

を定義したパーミッションクラスを用意することで対応できます

カスタマイズの例として, User モデルに対する権限設定を考えます

Userモデルに対する `CRUD` 操作のうち、

- アカウント作成は、アカウントを持っていないユーザーにも提供される
- 閲覧は、認証済みユーザーに制限される
- 更新 & 削除は、認証ユーザーが自身である場合に制限される

と言った形で権限設定をしたい場合は、以下のように実装できます

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

以上になります
