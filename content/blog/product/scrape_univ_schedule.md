---
title: "大学の学務システムからスケジュールをスクレイピングして, Google Calnderに反映する"
thumbnail: "/thumbnails/Python.png"
tags:
  - "Python"
category: "product"
date: "2020-02-20T20:01:02+09:00"
weight: 5
draft: true
---

大学の学務システムからスケジュールをスクレイピングして,

Google Calenderを更新するスクリプトを作ったので, ざっとメモを書いておきます.

## 環境

``` bash
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.15.3
BuildVersion:   19D76

$ python -V
Python 3.7.2
```

パッケージ管理には, pipenvを使っています.

## 学務システムのスクレイピング

スクレイピングには, selenium + chromedriver(ブラウザエミュレータ)と, beautifulsoup4 を用いました.

[ChromeDriver - WebDriver for Chrome](https://chromedriver.chromium.org/downloads)
から, 使用中の Google Chrome に合ったバージョンをダウンロードします.

``` bash
$ pipenv install seleinum beautifulsoup4
```

スクレイピングには, 以前書いたハンドラが合ったのでそれを利用しました.

### ハンドラ chrome_driver.py

``` python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from typing import Optional

from settings import CHROME_DRIVER_PATH


class ChromeHandler:
    def __init__(self, browser: bool = False) -> None:
        op = Options()
        op.add_argument("--disable-gpu")
        op.add_argument("--disable-extensions")
        op.add_argument("--proxy-server='direct://'")
        op.add_argument("--proxy-bypass-list=*")
        op.add_argument("--start-maximized")
        op.add_argument("--headless")

        if browser:
            self.driver = webdriver.Chrome(CHROME_DRIVER_PATH)
        else:
            self.driver = webdriver.Chrome(
                CHROME_DRIVER_PATH, options=op
            )

        self.soup = None

    def __wait__(self, _time: int, key: str, val: str) -> None:
        print("Search Element: ({}, {})".format(key, val))
        WebDriverWait(self.driver, _time).until(
            EC.presence_of_element_located(
                (key, val)
            )
        )

    def wait(self,
             _id: Optional[str] = None,
             cl: Optional[str] = None,
             selector: Optional[str] = None,
             _time: int = 30) -> None:
        params = [
            (By.ID, _id),
            (By.CLASS_NAME, cl),
            (By.CSS_SELECTOR, selector)
        ]
        for param in params:
            if isinstance(param[1], str):
                self.__wait__(
                    _time, param[0], param[1]
                )

    def access(self,
               url: str,
               _id: Optional[str] = None,
               cl: Optional[str] = None,
               selector: Optional[str] = None) -> None:
        self.driver.get(url)
        self.wait(_id=_id, cl=cl, selector=selector)
        self.set_soup()

    def set_soup(self) -> None:
        self.soup = BeautifulSoup(
            self.driver.page_source,
            features="html.parser"
        )

    def fin(self) -> None:
        self.driver.quit()
```

ハンドラは, driver と soup を持ちます.
クリックとかイベント起こしたいときは, seleniumのドライバから, ただ情報が取りたいだけのときは bs4 から拾ったほうが手軽です.

### ログイン

ユーザー名やパスワードといった認証情報は, .env に置きました.

``` python
from dotenv import load_dotenv
import os

load_dotenv()
USER_NAME = os.getenv('USER_NAME')
PASSWORD = os.getenv('PASSWORD')
```

ログインには, 

1. トップページへアクセス
2. ユーザー名とパスワードを入力
3. ログインをクリック or パスワード欄で Enter

の動作が必要なので, webdriver から操作してあげます.

``` python
handler = ChromeHandler(browser=False)

handler.driver.find_element_by_name('userName').send_keys(USER_NAME)
handler.driver.find_element_by_name('password').send_keys(PASSWORD)
handler.driver.find_element_by_name('password').send_keys(Keys.ENTER)
```

いい感じに class とか id がなかったら, XPATHを使うのが確実です. ([参考](https://nobuhiroharada.com/2018/06/22/easy-to-know-xpath-selector/))

## Google Calender API でスケジュールを更新する

スケジュールを拾ってくるところはできたので, あとは Google Calnder にスケジュールを作っていく辺りの処理を書いていきます.

[Python Quickstart - Google Calnder API](https://developers.google.com/calendar/quickstart/python?hl=ja)

から, Enbale the Google Calnder API すると, 設定情報をダウンロードできるので, プロジェクト下に置いてあげます.

公式の quickstart.py を書き換えて実行します.

``` python
from __future__ import print_function
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = [
    'https://www.googleapis.com/auth/calendar'
]


class GoogleCalnderHandler:
    def __init__(self) -> None:
        creds = None
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json',
                    SCOPES
                )
                creds = flow.run_local_server(port=0)
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        self.service = build('calendar', 'v3', credentials=creds)

    def get_events(self, result_num=10) -> None:
        now = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
        events_result = self.service.events().list(calendarId='primary', timeMin=now,
                                                   maxResults=result_num, singleEvents=True,
                                                   orderBy='startTime').execute()
        events = events_result.get('items', [])

        if not events:
            print('No upcoming events found.')
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            print(start, event['summary'])


if __name__ == '__main__':
    handler = GoogleCalnderHandler()
    handler.get_events()
```

予定の更新ができるように, スコープを変更しつつ, クラスに変えておきました.

次に, 大学のスケジュールを書き込んでいくカレンダーを作って, Calender IDをコピってきます(その他のカレンダーから作成して, 適当にスクロールすると書いてあります).

**.env**

``` txt
USER_NAME='xxx'
PASSWORD='xxx'
CALENDER_ID='xxx.calendar.google.com'
```

**settings.py**

``` python
CALENDER_ID = os.getenv('CALENDER_ID')
```

これで準備ができたので, ハンドラにカレンダー更新メソッドを実装しておきます.

``` python
from settings import CALENDER_ID


class GoogleCalnderHandler:
    ...
    def add_event(self,
                  title: str,
                  start_datetime: datetime.datetime,
                  end_datetime: datetime.datetime,
                  location: Optional[str]
                  ) -> Dict[str, Any]:
        event_param = {
            'summary': title,
            'location': location,
            'start': {
                'dateTime': start_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
                'timeZone': 'Japan',
            },
            'end': {
                'dateTime': end_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
                'timeZone': 'Japan',
            },
        }
        return service.events().insert(
            calendarId=CALENDER_ID,
            body=event_param
        ).execute()
```

これで, 組み合わせて一通りスクレイピングしてそのまま Google Calnder を書き換えることができました(⇓の感じ).

``` bash
$ pipenv run start
Loading .env environment variables…
Success: no issues found in 5 source files
Search Element: (id, LoginFormSimple)
Search Element: (class name, mysch-portlet)
2020/02/03(Mon) []
2020/02/04(Tue) []
2020/02/05(Wed) []
2020/02/06(Thu) []
2020/02/07(Fri) [1-2. FU11数値解析[CS]]
2020/02/10(Mon) [7-8. EL131LanguageandLinguistics]
2020/02/11(Tue) []
2020/02/12(Wed) [5-6. IT11情報検索と自然言語処理[CS]]
2020/02/13(Thu) []
2020/02/14(Fri) []
2020/02/17(Mon) []
2020/02/18(Tue) []
2020/02/19(Wed) []
2020/02/20(Thu) []
2020/02/24(Mon) []
2020/02/25(Tue) []
2020/02/26(Wed) []
2020/02/27(Thu) []
2020/02/28(Fri) []
1-2. FU11数値解析[CS] は重複しているのでスキップしました.
7-8. EL131LanguageandLinguistics は重複しているのでスキップしました.
5-6. IT11情報検索と自然言語処理[CS] は重複しているのでスキップしました.
```

ソースコードは, [ここ](https://github.com/kaito1002/Scrape_univ_schedule) に置いてあります.
