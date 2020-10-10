---
title: "Djangoでカスタムユーザーのマイグレーションに失敗するときの対処法"
description: "Djangoへカスタムユーザーのマイグレーションに失敗するときの対処法について解説します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "Django"
category: "Django"
date: "2020-01-17T09:12:07+09:00"
weight: 5
draft: true
---

djangoでカスタムユーザーのマイグレーションがうまく行かなくなったときの対処法.

``` bash
$ python manage.py makemigrations
django.db.migrations.exceptions.InconsistentMigrationHistory: Migration admin.0001_initial is applied before its dependency user.0001_initial on database 'default'.
```

スタックオーバーフローに解決策が載ってた.

[python - django.db.migrations.exceptions.InconsistentMigrationHistory - Stack Overflow](https://stackoverflow.com/questions/44651760/django-db-migrations-exceptions-inconsistentmigrationhistory)

adminで認証使うからそのへんで不整合が起きてるくさい(?)

adminに関するところを一旦コメントアウトする.

**config/settings.py**

``` python
INSTALLED_APPS = [
    # 'django.contrib.admin',
    ...
]
```

**config/urls.py**

``` python
urlpatterns = [
    # path('admin/', admin.site.urls),
    ...
]
```


で migrate すると,

``` bash
$ python manage.py migrate
Operations to perform:
  Apply all migrations: auth, contenttypes, sessions, user
Running migrations:
  Applying user.0001_initial... OK
```

成功.

あとはコメントアウトを解けばおけ.
