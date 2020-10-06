---
title: SQLArchemyでsqlite3とpostgreSQLを操作する
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
  - "データベース"
  - "Flask"
  - "SQLArchemy"
category: "Python"
date: "2019-06-28T00:46:48+09:00"
weight: 5
draft: true
---

**SQLArchemy**

からsqlite3とpostgreSQLを操作する手法を備忘録としてまとめます.

## 環境と導入

- Mac OS Mojava
- Python 3.7.2

``` bash
$ brew install postgresql
$ pip install sqlrchemy
$ pip install psycopg2  # postgreSQL用
```

## データベースの作成

データベースの作成や, サーバーの起動等はシェルから.

### sqlite3

sqlite3はファイルベースのデータベースで, カレントディレクトリにファイルが作られる.

ファイルベースなので, サーバーを起動する必要はない.

試しに, sample.dbを作る.

``` bash
$ sqlite3 sample.db
sqlite3> .databases
main: /Users/path/to/sample.db
sqlite3> .quit
```

GUIアプリからデータベースの中身を確認したい場合は,

[DB Browser for SQLite](https://sqlitebrowser.org/dl/)

がおすすめ. Professional版のPycharmなら標準で搭載してたはず.

### PostgreSQL

``` bash
$ postgres -D /usr/local/var/postgres
2019-06-27 23:43:00.852 JST [72924] LOG:  listening on IPv4 address "127.0.0.1", port 5432
2019-06-27 23:43:00.852 JST [72924] LOG:  listening on IPv6 address "::1", port 5432
2019-06-27 23:43:00.852 JST [72924] LOG:  listening on Unix socket "/tmp/.s.PGSQL.5432"
2019-06-27 23:43:00.864 JST [72925] LOG:  database system was shut down at 2019-06-27 12:07:37 JST
2019-06-27 23:43:00.868 JST [72924] LOG:  database system is ready to accept connections
```

以上から, ホストとポート番号を把握しておく.

今回は,

- ホスト: 127.0.0.1
- ポート: 5432

これで, DB用のサーバーを起動できたわけだが, サーバー起動した状態でないと当然データベースに接続できないので, 以降は別タブから作業する.

``` bash
$ psql -l  # 作成済みデータベース一覧を取得
$ createuser -P sampleuser  # ユーザー( sampleuser )の作成
Enter password for new role: 0000
Enter it again: 0000
$ createdb sampledb -O sampleuser  # データベース(sampledb)を作成, オーナーとして sampleuser を指定.
$ psql -l
                            List of databases
   Name    |   Owner    | Encoding | Collate | Ctype | Access privileges
-----------+------------+----------+---------+-------+-------------------
 sampledb  | sampleuser | UTF8     | C       | C     |
(1 rows)
```

同様にGUIアプリから参照したければ,

[Postice](https://eggerapps.at/postico/)

がおすすめ. 有料アプリだがトライアル版なら制約付きだが無料で無期限に使える.


## SQLArchemyからデータベースに接続

``` python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine(url, echo=True)
Base = declarative_base()
Base.metadata.create_all(engine)
```


以上のコードがデータベース接続に用いる最小限のコード.

URLにデータベースの種類毎に規定された適切なURLを渡すことで接続できる.

### sqlite3

sqlite3はファイルベースのDBなので, ファイルのパスを渡せばOK.

``` python
url_sqlite3 = "sqlite:///sample.db"
```

### postgreSQL

``` python
user = "sampleuser"
password = "password"
server = "127.0.0.1"
port = "5432"
db_name = "sample"
url_psql = f"postgresql+psycopg2://{user}:{password}@{server}:{port}/{db_name}"
```

**user** と, **password** は createuserで作成したもので,

**server** と**port** はSQLサーバー起動時にメモったもの,

**db_name** が createdbで作成したデータベース名.

## モデルを定義

``` markup
データベース
    - テーブル1 (Row × Columnの2次元配列的な)
        - 要素1
        - 要素2
        - 要素3
    - テーブル2
    - テーブル3
```

以上のデータベースの基本構成に対して, SQLArchemyは,

データベースの各テーブルに対応したクラスを定義してそれを扱う形でDBを操作する(そのクラスのインスタンスが要素になる).

以下は, 単純なユーザーを管理するテーブルに対応させたクラス.

カラムとして,

- id (primary_key)
- name
- mail (unique)
- password

を持つ.

``` python
from sqlalchemy import Column, String, Interger

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    mail = Column(String, unique=True)
    password = Column(String)

    def __repr__(self):
        return "<User(id='%s', name='%s', mail='%s', password='%s')>" % (
            self.id,
            self.name,
            self.mail,
            self.password
            )
```

- primary_key=True : 自動的に添え字を割り振ってくれる.
- unique=True : 重複を禁止

## セッション

データベースの要素を操作するには, セッションを使う.

``` python
from sqlalchemy.orm import sessionmaker

sess_maker = sessionmaker(bind=engine)
sess = sess_maker()
```

### 要素の追加

``` python
user = User(name="Taro", mail="taro@mail.com", password="xxxx")
sess.add(user)
sess.commit()
```

### 要素の変更

メールアドレスをキーに, そのユーザーのパスワードを変更する例.

``` python
user = sess.query(User).filter_by(mail="taro@mail.com").first()
if user is None:
    print("Mail Addres Not Found")
else:
    user.password = "newpassword"
    sess.add(user)
    sess.commit()
    print("Password changed!")
```

### 要素の削除

メールアドレスをキーに, そのユーザーを削除する例.

``` python
user = sess.query(User).filter_by(mail="taro@mail.com").first()
if user is not None:
    sess.delete(user)
    sess.commit()
```

### 全要素の取得

``` python
users = sess.query(User).all()
```

### その他の操作

.first(), .all()の他に, .one()もある.

挙動は以下の通り.

| メソッド | 戻り値 |
|:--- |:--- |
| one() | 唯一のインスタンスを返す, 複数存在 or 存在しない -> Error |
| first() | 最初に見つかったインスタンス, なければNone |
| all() | 見つかったインスタンスのリスト, なければ空リスト |

このように, SQLを直接いじるのではなく対応しているインスタンスのプロパティをいじることになるので, SQL文が一切分からずとも直感的に様々な操作が行える.

## 全文

ちらかったので, 最後に全文をまとめる.

``` python
from sqlalchemy import create_engine, Column, String, Interger
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

url_sqlite3 = "sqlite:///sample.db"

user = "sampleuser"
password = "password"
server = "127.0.0.1"
port = "5432"
db_name = "sample"
url_psql = f"postgresql+psycopg2://{user}:{password}@{server}:{port}/{db_name}"

db_type = "psql"  # or sqlite3

url = url_sqlite3
if db_type == "psql":
    url = url_psql

engine = create_engine(url, echo=True)
Base = declarative_base()
Base.metadata.create_all(engine)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    mail = Column(String, unique=True)
    password = Column(String)

    def __repr__(self):
        return "<User(id='%s', name='%s', mail='%s', password='%s')>" % (
            self.id,
            self.name,
            self.mail,
            self.password
            )

sess_maker = sessionmaker(bind=engine)
sess = sess_maker()


def add_user(name, mail, password):
    user = User(name=name, mail=mail, password=password)
    sess.add(user)
    sess.commit()

def change_passwd(mail, password):
    user = sess.query(User).filter_by(mail=mail).first()
    if user is None:
        print("Mail Addres Not Found")
    else:
        user.password = password
        sess.add(user)
        sess.commit()
        print("Password changed!")

def delete_user(mail):
    user = sess.query(User).filter_by(mail=mail).first()
    if user is not None:
        sess.delete(user)
        sess.commit()

def get_all_users():
    return sess.query(User).all()
```

閲覧ありがとうございました😁
