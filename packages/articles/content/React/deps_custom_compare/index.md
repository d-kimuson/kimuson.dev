---
title: "useEffectやuseMemo,useCallbackで依存配列チェックをカスタマイズするメモ"
description: useEffectやuseMemo,useCallbackで依存配列チェックをカスタマイズするメモ
category: "React"
tags:
  - React
date: "2023-11-07T01:06:46Z"
thumbnail: "thumbnails/React.png"
draft: false
---

## TL;DR

useEffect や useMemo, useCallback で依存配列の同値チェックをカスタマイズするときのカスタムフックメモ

## 前提

useEffect や useMemo 等の依存配列を第2引数にとるフックは依存配列が変化したときに再実行（useEffectであれば実行・useMemo/useCallback であれば再生成）を行うが、値比較ではなく参照での比較なので値が変わっていなくても再実行されてしまうことがある。とてもよくある。

例として以下のコンポーネントをレンダリングすると

```ts
const useObjectStyleState = () => {
  const [state, setState] = useState({ key: 'value' });

  useEffect(() => {
    const id = window.setInterval(() => {
      setState({ key: 'value' });
    }, 2000);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  return state;
};

const MyComponent: FC = () => {
  const state = useObjectStyleState();

  useEffect(() => {
    console.log('state changed!', state);
  }, [state]);

  return <></>
}
```

2秒ごとに `state changed!` のログがコンソールに流れる

値が一致しているときには再実行をしないでほしい場合や、比較ロジックを制御したいとき用のカスタムフックのメモ

## useDeps

[useEffectのdeps比較関数をカスタムしたくなったときにやること - uhyo/blog](https://blog.uhy.ooo/entry/2020-05-24/react-custom-deps/)

[uhyo\_](https://twitter.com/uhyo_) さんの記事で紹介されているやつ

```ts
function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const prevValue = ref.current
  ref.current = value
  return prevValue
}
```

```ts
export function useDeps<Deps extends any[]>(
  deps: Deps,
  compare: (prev: Deps, current: Deps) => boolean
): number {
  const counter = useRef(0)
  const prevDeps = usePreviousValue(deps)
  if (prevDeps === undefined) {
    return counter.current
  }
  if (!compare(prevDeps, deps)) {
    counter.current++
  }
  return counter.current
}
```

usePreviousValueのカスタムフックで前回の値を取得して引数で渡されたカスタムな比較関数の結果を元に一致してれば同じ count を、一致してなければインクリメントした count を返し、この戻り値を依存配列に渡すことで比較関数を元に再実行をするか制御できる

というもの。

## useComparableMemo

useDeps は exhaustive-deps (使っているstateをdepsに追加しようね、というやつ) の eslint ルールに引っかかってしまうので count の値ではなく count の値を元に memo 化した値を返すカスタムフックを用意する

```ts
const useComparableMemo = <Value extends unknown>(
  value: Value,
  compare: (prev: Value, current: Value) => boolean
): Value => {
  const counter = useRef(0)
  const prevDep = usePreviousValue(value)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memorizedDep = useMemo(() => value, [counter.current])

  if (prevDep === undefined) return memorizedDep

  if (!compare(prevDep, value)) {
    counter.current++
  }

  return memorizedDep
}
```

比較のロジック等は useDeps と一緒で、count ではなく count を依存配列にとった useMemo した値を返すようにした。

こっちだと useComparableMemo 内の useMemo では exhaustive-deps を無効にする必要があるが、利用側では気にしなくてよくなる

```ts
const MyComponent: FC = () => {
  const state = useObjectStyleState();
  const memorizedState = useComparableMemo(state, (a, b) => a.key === b.key);

  useEffect(() => {
    console.log('state changed!!', memorizedState);
  }, [memorizedState /* memorizedState 自体がメモ化されているので素直に deps における */]);

  return <></>
}
```

使い分けとしては exhaustive-deps を disable しなくて良い点は良いが、(値比較に変えたいというより)特定の useEffect の実行タイミングを制御するための比較関数を渡す、みたいな用途だと比較関数が関わらない部分の他の値で古いものが残ってしまうので useDeps が適しているかもしれない

例えば、ステートの `key1` が変わったときにだけ useEffect を再実行したい（他の `key2` が変わった時は再実行しなくて良い）みたいなことをしたくて

```ts
const MyComponent: FC = () => {
  const [state, setState] = useState({ key1: 'value', key2: 'hogehoge' });
  const memorizedState = useComparableMemo(state, (a, b) => a.key1 === b.key1);

  useEffect(() => {
    console.log('state changed!!', memorizedState);
  }, [memorizedState]);

  return <>{memorizedState.key2}</>
}
```

みたいな実装にしてしまうと useEffect 自体は意図通り動くが、表示に使っている `memorizedState.key2` は key2 が変わってもずっと古い値で描画されてしまう
