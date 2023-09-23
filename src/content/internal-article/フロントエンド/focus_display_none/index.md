---
title: "display:none;するとfocusできないらしい"
description: display:none;している要素にフォーカスをあてることができなかったので、調べた。
category: "フロントエンド"
tags:
  - Vue.js
date: "2021-04-29T10:15:04Z"
thumbnail: "thumbnails/フロントエンド.png"
draft: false
---

## TL;DR;

- `display: none` または `visibility: hidden` すると、アクセシビリティツリーから削除される
- アクセシビリティツリーに存在しない要素には支援系機能が使えない (今回では `focus`)
- 非表示から表示状態にして、要素にフォーカスを当てたいなら先に DOM を更新する必要あり
  - Flux にせよ MVVM にせよデータにバインドする形で UI を書いているなら(DOM の更新はステート更新より遅れるので)、フォーカスのタイミングを遅らせる必要がある

## 問題

Vue2 の単一ファイルコンポーネントで、`v-show` (`display: none`) で隠していた要素が表示されるタイミングでフォーカスを当てようと思って以下のようなコードを書きました

```markup
<template>
  <div v-show="isActive" @click="onClick">
    <input type="text" ref="input" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    onClick() {
      this.isActive = true;
      this.$refs.input.focus(); // Does not work
    },
  },
};
</script>
```

関数を抜けてから DOM が更新されるので、`v-if` で DOM が存在しないと怒られるのは納得なのですが、`display: none` してるだけで存在はしてる `v-show` でもフォーカスされず悩んでいたんですが、どうやら `display: none` している要素にもフォーカスは当てられれないようです

[display - CSS: カスケーディングスタイルシート #display: none \| MDN](https://developer.mozilla.org/ja/docs/Web/CSS/display#display_none)

> 要素の display の値に none を使用すると、その要素はアクセシビリティツリーから削除されます。すなわち、その要素とすべての子孫要素は読み上げ技術によって読み上げられなくなります。

アクセシビリティツリーから削除されるという記述があります

- [Accessibility tree (アクセシビリティツリー) - MDN Web Docs 用語集: ウェブ関連用語の定義 \| MDN](https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree)
- [アクセシビリティオブジェクトモデル \| aom](https://masup9.github.io/aom/explainer.html)

この辺を読んだ感じだと、アクセシビリティツリーのノードは `state` を持っていて、`focused` の状態で管理しているので、フォーカスを当てることができない、ということっぽいです

## 解決策

`display: none` 中にフォーカスするのが良くないだけなので、フォーカスを DOM の更新後に遅らせてやれば解決します

```diff
onClick() {
  this.isActive = true
- this.$refs.input.focus()                 // Does not work
+ this.$nextTick(() => refs.input.focus()) // Work!
},
```

1. isActive が変更
2. `display: none;` している `input` 要素にフォーカスを当てる ← `display: none` には focus できない
3. 関数を抜ける → DOM が更新(`display: none` を無効に)

ではダメなので

1. isActive が変更
2. 関数を抜ける → DOM が更新(`display: none` を無効に)
3. `input` 要素にフォーカス

にしてやる、ということです

## おまけ

ついでに、`visibility: hideen` にも

[visibility - CSS: カスケーディングスタイルシート #アクセシビリティの考慮 \| MDN](https://developer.mozilla.org/ja/docs/Web/CSS/visibility#accessibility_concerns)

> 要素の visibility の値に hidden を使用すると、 アクセシビリティツリーから削除されます。これは要素及びその子孫要素が読み上げ技術でアナウンスされない結果になります。

同様にアクセシビリティツリーから削除されるという記述があり、実際フォーカスを当てることはできませんでした

## 参考

- [display - CSS: カスケーディングスタイルシート \| MDN](https://developer.mozilla.org/ja/docs/Web/CSS/display)
- [visibility - CSS: カスケーディングスタイルシート \| MDN](https://developer.mozilla.org/ja/docs/Web/CSS/visibility)
- [Accessibility tree (アクセシビリティツリー) - MDN Web Docs 用語集: ウェブ関連用語の定義 \| MDN](https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree)
- [アクセシビリティオブジェクトモデル \| aom](https://masup9.github.io/aom/explainer.html)
