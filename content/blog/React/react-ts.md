---
title: "ReactN + TypeScript + React Router SPA"
thumbnail: "/thumbnails/prog_g.png"
tags:
  - "TypeScript"
  - "JavaScript"
  - "React"
category: "React"
date: "2020-01-05T04:40:31+09:00"
weight: 5
draft: true
---

React hooksが書きやすそうだったので試す.

## 導入

``` bash
$ npx create-react-app myapp --template typescript
$ cd myapp
$ yarn add reactn react-router-dom @types/react-router-dom
```

## React Router

**src/App.tsx**

ここがindex.tsx(エントリーポイント)から呼ばれる大本のコンポーネント.

``` typescript
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/" exact>
          </Route>
          <Route path="/user/:id" exact>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
```

Routeタグの中に, 各ページに該当するコンポーネントを挟んでいく形になる

各ページの遷移は, 

``` typescript
import { useHistory } from 'react-router-dom';

const history = useHistory();
<button onClick={() => history.push('/')}>Click Me</button>
```

って感じで, historyに履歴新規リンク突っ込めば勝手に遷移してくれる.

頻繁に使いそうなのでコンポーネント化して,

``` typescript
import { useHistory } from 'react-router-dom';

export const LinkButton: React.FC<{ path: string, buttonText: string }> = (props: { path: string, buttonText: string }) => {
  const history = useHistory();
  return (
    <button onClick={() => history.push(props.path)}>{props.buttonText}</button>
  )
}
```

としておいておけば,

``` typescript
<LinkButton path="/" buttonText="Click Me" />
```

みたいな感じで使える.

リンクは, パラメータの取得も行えて /user/:id みたいにしておけば, 

``` typescript
import { useParams } from 'react-router-dom';
const { id } = useParams();
```

みたいに渡せる.

## React Hooks

関数ベースのコンポーネントでは状態管理ができなかったけど, React Hooksによって可能になった.

### state 管理

useState(デフォルト値)を呼ぶと, stateとその更新用関数が帰ってくる.

``` typescript
import React, { useState } from 'reactn';
const [count, setCount] = useState(0);
```

あとは, buttonのonClickとかでsetCount(更新後の値)を読んであげたり, 普通に変数としてcountを使えばいい.

### レンダリング後の処理

``` typescript
import React, { useEffect } from 'reactn';

useEffect(() => console.log('This function is called after rendering'));
```

useEffectに渡した関数はレンダリング後に呼ばれる.

### Context (親 => 子コンポーネントへの値の受け渡し)

親側(値を渡す側)は,

``` typescript
import React, { crerateContext } from 'reactn';

const CountContext = createContext({
  count: 0
})

<CountContext.Provider value={{ count: 10 }}>
  <渡したいコンポーネント />
</CountContext.Provider>
```

子側(受け取る側)は,

``` typescript
import React, { useContext } from 'reactn';

const { count } = useContext(CountContext);
// 使う
```

孫とかにも渡せる

## ReactN

一般的には, 全体で共有する状態を管理する目的でReduxを使うが, 重いのでReactNを使う.

参考: [Redux不要論と、グローバル状態管理ライブラリReactNの紹介](https://qiita.com/tuttieee/items/e5b2725b3e58cae9ddd6)

設定は, 通常のReactとかとかを 'react'からじゃなくて 'reactn' から呼ぶようにするだけ.

値のセットと呼び出しには, setGlobal, getGlobalを使う.

``` typescript
import React, { setGlobal, getGlobal } from 'reactn';

setGlobal({
  message: "Hello World"
});

const global: { message: string } = getGlobal();
console.log(global.message);  // Hello World
```

どこから呼んでも値を取れるから, 全体で共通の状態を持ちたいだけならこれで十分な気がする(正直初心者の僕には, Reduxおもすぎてきつい).

使ったリポジトリ: [kaito1002/reactn-ts-router](https://github.com/kaito1002/reactn-ts-router)

Vue派だったけど, 関数ベースのコンポーネントが想像以上に書きやすかったから手のひらクルーしそう.