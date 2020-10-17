---
title: "Djangoでカスタムユーザーのマイグレーションに失敗するときの対処法"
description: "Djangoでカスタムユーザーのマイグレーションに失敗するときの対処法について解説します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2020-01-17T09:12:07+09:00"
weight: 5
draft: false
---

`Django` アプリの作成の途中(たぶんマイグレーション済み?)で､ ベーシックユーザーからカスタムユーザーに変更すると、マイグレーションに失敗します｡

``` bash
$ python manage.py makemigrations
django.db.migrations.exceptions.InconsistentMigrationHistory: Migration admin.0001_initial is applied before its dependency user.0001_initial on database 'default'.
```

## 対処法

`admin` に関する部分をコメントアウトします｡

### config/settings.py

``` python
INSTALLED_APPS = [
    # 'django.contrib.admin',
    ...
]
```

### config/urls.py

``` python
urlpatterns = [
    # path('admin/', admin.site.urls),
    ...
]
```

この状態でマイグレーションしてあげます｡

``` bash
$ python manage.py migrate
Operations to perform:
  Apply all migrations: auth, contenttypes, sessions, user
Running migrations:
  Applying user.0001_initial... OK
```

上手くいきます｡

あとはコメントアウトを解いてあげます｡

## swappable オプションを使う

以上で解決できない場合は､

公式ドキュメントの [Customizing authentication in Django # Changing to a custom user model mid-project | Django documentation | Django](https://docs.djangoproject.com/en/3.1/topics/auth/customizing/#changing-to-a-custom-user-model-mid-project) が参考になるかもしれません｡

``` python:title=models.py
class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        swappable = 'AUTH_USER_MODEL'
    # ...
```

`class Meta` に､ `swappable` オプションをしてマイグレーションします｡

``` bash
$ dj migrate
SystemCheckError: System check identified some issues:

ERRORS:
app.User.user_permissions: (fields.E304) Reverse accessor for 'User.user_permissions' clashes with reverse accessor for 'User.user_permissions'.
        HINT: Add or change a related_name argument to the definition for 'User.user_permissions' or 'User.user_permissions'.
auth.User.user_permissions: (fields.E304) Reverse accessor for 'User.user_permissions' clashes with reverse accessor for 'User.user_permissions'.
        HINT: Add or change a related_name argument to the definition for 'User.user_permissions' or 'User.user_permissions'.

# swappable 指定後
$ dj migrate
Operations to perform:
  Apply all migrations: admin, app, auth, contenttypes, sessions
Running migrations:
  Applying app.0002_user... OK
```

上手くいきます｡

## そもそも起きないようにする

公式ドキュメントでは､

> If you’re starting a new project, it’s highly recommended to set up a custom user model, even if the default User model is sufficient for you.

てな感じで、そもそも初期段階でユーザーモデルを差し替えちゃいなさいと言ってるので､ なにより先にユーザーモデルをカスタムユーザーに差し替えておくのが良さそうです｡

## 参考

- [python - django.db.migrations.exceptions.InconsistentMigrationHistory - Stack Overflow](https://stackoverflow.com/questions/44651760/django-db-migrations-exceptions-inconsistentmigrationhistory)
- [Customizing authentication in Django | Django documentation | Django](https://docs.djangoproject.com/en/3.1/topics/auth/customizing/)
