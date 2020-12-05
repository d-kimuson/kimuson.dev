---
title: "Django REST frameworkでトークン認証をする"
description: "Django REST frameworkでトークン認証をする方法を紹介します。"
thumbnail: "/thumbnails/Django.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2019-09-25T18:54:07+09:00"
weight: 5
draft: false
---

Django REST framework でトークン認証をするメモ

## トークンの作成と取得

まずは, `INSTALLED_APPS` に `rest_framework.authtoken` を追加しておく

``` python:settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',  # <= 追加
    'api'
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}
```

これでトークン用モデルが定義されたので、マイグレーションを実行する

``` bash
$ python manage.py makemigrations && python manage.py migrate
```

## トークンを取得するAPIエンドポイントの作成

`rest_framework.authtoken` にトークン取得用の view が定義されているのでルーティングをつけてあげる

``` python
import rest_framework.authtoken.views as auth_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-token-auth/', auth_views.obtain_auth_token)  # <= 追加
]
```

## トークンの作成

引数に User モデルのインスタンスを渡して、普通に作ればOK

``` python
from rest_framework.authtoken.models import Token

Token.objects.create(
    user=user  # userは User モデルインスタンス
)
```

ユーザーが作成されると同時にトークンも自動生成するようにすることが望ましいので、ユーザーモデルをカスタマイズして自動的にトークンを作るようにしておく

## カスタムユーザーの定義

トークンと紐付けるカスタムユーザーを, `AbstarctBaseUser` から定義していく

トークン認証に使うユーザーモデルは, `settings.py` で

``` python
# config/settings.py
AUTH_USER_MODEL = 'api.User'
```

と指定しておく必要がある

ただこうすると、管理ページへのログインもこの User を使うようになるので、 superuser 関連の設定もしておく

**カスタムユーザーモデル**

``` python:models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


class UserManager(BaseUserManager):
    def create_user(self, email: str, password: str) -> 'User':
        user = User(
            email=BaseUserManager.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)

        # トークンの作成
        Token.objects.create(user=user)
        return user

    def create_superuser(self, email: str, password: str) -> 'User':
        u = self.create_user(email=email,
                             password=password)
        u.is_staff = True
        u.is_superuser = True
        u.save(using=self._db)
        return u


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        unique=True,
        blank=False
        )
    password = models.CharField(
        _('password'),
        max_length=128
        )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()
```

あとは普通に、`serializer` と `view` とルーティングを書く

``` python:serializers.py
from api.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
```

``` python:views.py
from api.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

``` python:urls.py
from rest_framework import routers
from .views import UserViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)
```

これで完成

マイグレーションすれば、

``` bash
$ python manage.py makemigrations && python manage.py migrate
```

また、既存のユーザーには

``` bash
$ python manage.py shell
In [1]: from api.models import User
In [2]: from rest_framework.authtoken.models import Token
In [3]: for user in User.objects.all():
            try:
                Token.objects.create(
                    user=user
                )
            except Exception:
                pass
```

こんな感じで付与できる

## トークンの取得

開発サーバーを建てた状態で, [httpie](https://httpie.org/) でAPIを叩いてみる

``` bash
$ http POST http://127.0.0.1:8000/api-token-auth/ username=hoge@example.com password=hoge
HTTP/1.1 200 OK
Allow: POST, OPTIONS
Content-Length: 52
Content-Type: application/json
Date: Mon, 25 May 2020 03:55:24 GMT
Server: WSGIServer/0.2 CPython/3.7.2
Vary: Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

ここで、`username` は、Userモデルにて `USERNAME_FIELD` に規定したもの

``` python
class User(AbstractBaseUser, PermissionsMixin):
    ...
    USERNAME_FIELD = 'email'
    ...
```

## トークン認証

まだトークン認証はできるようになったが、各エンドポイントには認証なしでアクセスできるという状態なので、パーミッションクラスを書き換えておく

``` python:settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

基本的にはトークン認証だけで良いが、DRFでは各エンドポイントにアクセスしたときにAPIリファレンス(っぽいもの)が見れるので、セッションベースの認証を追加しておくとフロントエンド開発がしやすい(APIの各エンドポイントをブラウザで叩くことで実際のレスポンスが見られる)

これで, 全ての `view` のパーミッションがデフォルトが認証済みユーザー指定になった

認証いらずの `View` は、

``` python
from rest_framework.permissions import AllowAny


class HogeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
```

のように各ビューで上書きできる
