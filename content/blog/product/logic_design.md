---
title: "論理式から真理値表を作成するスクリプトを作りました"
description: "論理式から真理値表を作成するスクリプトを作りました"
thumbnail: "/thumbnails/Python.png"
date: "2018-11-06T13:28:40+09:00"
tags:
  - "Python"
category: "product"
weight: 5
draft: true
---

大学の演習で論理回路系のツールが使いにくくて, 論理式から真理値表に変換できるツールがほしいなってなったので,

1. 文字列で記述した論理式を逆ポーランド記法のリストに変換する
1. 逆ポーランド記法に変換したリストから真理値を計算して表示
1. ついでにPlotする

の手順で作ってみました.

## String型の論理式を逆ポーランド記法のリストに変換する

前提として, 論理式は 論理積( and )は \*記号, 論理和( or )は＋, 否定( not )は_で表現することにしました.

### 逆ポーランド記法とは

ポーランドの偉大な誰かさんが考案したポーランド記法を逆順に並べたみたいな記法です.

通常の計算式は演算子( +, * ()など )の優先順位とかの問題でコンピュータで扱うのに適してないのに対して, 逆ポーランド記法によって記述した計算式は

[スタック](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)

を使うことによって容易にコンピュータで扱うことができます.

例えば, 1 + 2 * 3 + 4 を逆ポーランド記法で表現すると,

1 2 3 * + 4 + ... ①

というようになります.先頭(1)側から１個ずつトークン(演算子や数字などの最小単位)を取り出して, 数字ならスタックに追加, 演算子ならスタックの後ろから２つを使用して演算してスタックの最後に戻す, というようにして計算ができます.

①式ならスタックを使うことで,

1. [1]
1. [1, 2]
1. [1, 2, 3]
1. [1, 6]
1. [7, 4]
1. [11]

というように計算されます.

詳しく知りたい方は,
[逆ポーランド記法 - ウィキペディア](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%83%BC%E3%83%A9%E3%83%B3%E3%83%89%E8%A8%98%E6%B3%95)
でも眺めてみてください.

### Not ( _ ) の扱い

一般的な逆ポーランド記法では, 論理演算を扱わないので Not の扱いにやや困りました( 二項演算子ではなく, 単項演算子なので ).

結論としては, Not A なら A _ と記述すれば同様に計算できることに気づきました.

### 変換プログラムの作成

フローチャート付きの
[こちらのサイト](http://home.a00.itscom.net/hatada/c-tips/rpn/rpn02.html)
を参考にさせてもらいました.

これに加えて,

NOT に関しては, _ ( x x x ) と_ x の2パターンが考えられます.

- スタック末が _ で, 次トークンが数字ならトークンと _ をバッファに
- ) がきたときに, チャート通り(までバッファに格納した後, _ が直前に存在すればこれもセットでバッファに格納する

という処理で論理式を適切に逆ポーランド記法に変換できるようにしました.

ソースコードは以下の通り.

``` python
def PolandRev(formula):
    formula_list: formula.split(" ") # スペース区切りで計算式をリストへ.
    opperands: ["+", "*", "_", "(", ")"]
    priority: {
        "(" : 20, ")" : 20,
        "_" : 10,
        "*" : 5,
        "+" : 0
    }
    stack: [] # オペランドを一時的に入れる
    buffer: [] # 完成した式をいれる
    checked: False

    for token in formula_list:
        if token in opperands:
            # オペランドである
            if token == opperands[3]:  # "("
                stack.append(token)
            elif token == opperands[4]:  # ")"
                for i in reversed(range(len(stack))):
                    if stack[i] == "(":
                        stack.pop(i)
                        break
                    else:
                        buffer.append(stack.pop(i))
                if checked and stack[len(stack) - 1] == "_":
                    buffer.append(stack.pop())
                    checked: False
            elif token == opperands[2]: # _
                checked: True
                stack.append(token)
            else : # _ or * or +
                while(1):
                    try:
                        lead: priority[stack[len(stack)-1]]
                    except Exception:
                        lead: -1
                    if lead == -1 or priority[token] > lead or lead == 20:
                        stack.append(token)
                        break
                    else :
                        buffer.append(stack.pop(len(stack)-1))

        else :
            # オペランドでない, 値である
            buffer.append(token)
            if checked and stack[len(stack) - 1] == "_":
                buffer.append(stack.pop())
                checked: False

    for i in reversed(range(len(stack))):
        buffer.append(stack.pop(i))
    print("逆ポーランド記法 :", end=" ")
    print(buffer)
    return buffer
```

## 逆ポーランド記法に変換したリストから心理値を計算をする <a id="#chapter2"></a>

逆ポーランド記法に変換できたのであとは計算するだけです.

論理演算なので変数に対応した 0 or 1のリストを作成して使用する必要があります.リストを手動で作成するのは馬鹿らしかったので 次元数( key )を渡せば２進数のインクリメント的な感じで作ってくれる関数を事前に定義しました.

例えば key: 2なら

```
0 0
0 1
1 0
1 1
```

を作ってくれるということです.

てことで,

1. Input用リストを作成
2. トークンを取得
3. トークンが変数ならリストに基づいた 1 or 0をスタックへ
4. トークンがオペランド(演算子)なら
    - _ ならスタックから1個取り出して否定演算をしてスタックへ
    - \+ or \*なら2個取り出して 論理和(積)の演算をしてスタックへ
5. トークンがまだ存在すれば2へ戻る

というアルゴリズムで作成しました.

ソースコードは以下の通り.

``` python
def PolandCalc(formula, input=-1):
    count: 0
    stack: []
    variables: {}
    tmp: []
    opperands: ["+", "*", "_"]
    for token in formula:
        if token not in opperands and token not in variables:
            variables[token]: count
            count += 1
    if input == -1:
        input: makeList(count)
    for dataset in input:
        for token in formula:
            if token == opperands[0]:  # +
                x: stack.pop(0)
                y: stack.pop(0)
                stack.insert(0, x or y)
            elif token == opperands[1]:  # *
                x: stack.pop(0)
                y: stack.pop(0)
                stack.insert(0, x and y)
            elif token == opperands[2]:  # _
                x: stack.pop(0)
                if x == 0:
                    y: 1
                else:
                    y: 0
                stack.insert(0, y)
            else :
                stack.insert(0, dataset[variables[token]])
        tmp.append(stack[0])
        stack: []
    tmp2: [*variables.keys()]
    tmp2.append("F")
    input.insert(0, tmp2)
    for i in range(len(tmp)):
        input[1 + i].append(tmp[i])
    printInfo(input)
    return input

def makeList(key):
    returnList: []
    pad: "{:0=" + str(key) + "}"
    for i in range(2 ** key):
        tmp: format(i, "b")
        returnList.append([*pad.format(int(tmp))])
        returnList[i]: [int(x) for x in returnList[i]]
    return returnList

def printInfo(dataset):
    count: 0
    for i in range(len(dataset[0])):
        print(dataset[0][i], end="\t")
    print("")
    for set in dataset:
        count += 1
        if count == 1:
            continue
        for value in set:
            print(str(value), end="\t")
        print("")
```

てことで実際に AND ゲートを試してみます.
``` python
PolandCalc(PolandRev("A * B * C"))
```

**実行結果**

``` bash
逆ポーランド記法 : ['A', 'B', '*', 'C', '*']
A	B	C	F
0	0	0	0
0	0	1	0
0	1	0	0
0	1	1	0
1	0	0	0
1	0	1	0
1	1	0	0
1	1	1	1
```

期待通りの動きをしてくれてます.

## ついでにPlotする

ここまでできたら matplotlib を使ってプロットもしたいなって感じがしたのでおまけ.

``` python
import matplotlib.pyplot as plt

def Simulate(dataset, key):
    accuracy: 0.01
    count: 0
    time: - (accuracy / 2)
    colors: ["red", "blue", "green", "magenta"]
    plotLists: []
    timeList: []
    variables: []
    for data in dataset:
        if count == 0:
            count += 1
            for i in range(len(data)):
                plotLists.append([])
            variables: data
        else :
            time += accuracy
            timeList.append(time)
            for i in range(len(plotLists)):
                plotLists[i].append(data[i])
            time += (key - accuracy)
            timeList.append(time)
            for i in range(len(plotLists)):
                plotLists[i].append(data[i])
    fig: plt.figure( figsize=(12, 12) )

    count: 0
    for i in range( len(plotLists) ):
        plt.axes( [0, 1 - count, 1, 0.05] )
        plt.ylim([-0.05, 1.05])
        plt.plot(timeList, plotLists[i], label: variables[i], color: colors[i % 4])
        plt.legend()
        count += 0.1
    plt.show()
    return dataset
```

んで最後にめんどいので関数を統合して,

``` python
def IntegrationCalc(formula, key=50): # key は時間間隔( 単位は ns )
    Simulate(PolandCalc(PolandRev(formula)), key)
```

て感じで完成！

早速ちょい複雑めに, "_ ( A + B ) * C + _ D * E"の論理演算をさせてみる.

``` python
IntegrationCalc("_ ( A + B ) * C + _ D * E")
```

で結果が,

``` bash
逆ポーランド記法 : ['A', 'B', '+', '_', 'C', '*', 'D', '_', 'E', '*', '+']
A	B	C	D	E	F
0	0	0	0	0	0
0	0	0	0	1	1
0	0	0	1	0	0
0	0	0	1	1	0
0	0	1	0	0	1
0	0	1	0	1	1
0	0	1	1	0	1
0	0	1	1	1	1
0	1	0	0	0	0
0	1	0	0	1	1
0	1	0	1	0	0
0	1	0	1	1	0
0	1	1	0	0	0
0	1	1	0	1	1
0	1	1	1	0	0
0	1	1	1	1	0
1	0	0	0	0	0
1	0	0	0	1	1
1	0	0	1	0	0
1	0	0	1	1	0
1	0	1	0	0	0
1	0	1	0	1	1
1	0	1	1	0	0
1	0	1	1	1	0
1	1	0	0	0	0
1	1	0	0	1	1
1	1	0	1	0	0
1	1	0	1	1	0
1	1	1	0	0	0
1	1	1	0	1	1
1	1	1	1	0	0
1	1	1	1	1	0
```

作成できたプロット図は,

![プロット図](/media/images/logic_plot.png)

こんな感じ.
