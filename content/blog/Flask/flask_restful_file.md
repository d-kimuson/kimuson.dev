---
title: "axiosでファイルをPOSTし, flaskで受け取る"
description: "axiosでファイルをPOSTして、Flaskで受け取る方法について紹介します。"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "JavaScript"
category: "Flask"
date: "2019-08-17T13:23:24+09:00"
weight: 5
draft: true
---

クライアント(axios)からPOSTしたファイルをサーバーサイド(flask)で取得する方法について.

基本的には,

1. axiosから, multipart/form-data形式でファイルをPOSTする
2. flask.request.filesから取得する

という流れで実装する.

## 1. multipart/form-data で POST

``` bash
$ yarn add axios
```

npmを使ってる場合はそちらから.

Filesの取得は,
[ファイルリスト
](https://developer.mozilla.org/ja/docs/Web/API/FileList#Using_the_file_list)
を用います.

``` javascript
import axios from 'axios';

// <input id="file" type="file">
const file = document.getElementById('file').files[0];
const formData = new FormData();
formData.append("file", this.file);
axios.post('/api/upload', formData, {
  headers: {
    'content-type': 'multipart/form-data'
  }
}).then(response => {
  console.log(response);
});
```

## 2. flask側で取得

まずは, pip でflask_restfulを取得します.

``` bash
$ pip install flask_restful
```

appの作成はflaskを使えば当然すると思うのでその辺は割愛します.

``` python
from flask_restful import Api
from apis import UPLOADAPI

app.config['MAX_CONTENT_LENGTH'] = 1024 ** 3
api.add_resource(UPLOADAPI,
                 '/api/upload')
```

``` python
# apis.py
from flask_restful import Resource
from flask import request


class UPLOADAPI(Resource):
    def __init__(self):
        super(UPLOADAPI, self).__init__()

    def post(self):
        file = request.files['file']
        path = rootpath + f"/files/{file.filename}"
        file.save(path.path)
        return {'message': 'from post'}
```

これで, root/files/ファイル名に保存されます.
