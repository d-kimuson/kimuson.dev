# デザイン

## スタック

- tailwind
- shadcn-ui

## shadcn-ui の活用

shadcn-ui では、コレクションからコンポーネントを追加して利用可能。
コレクションに適切なコンポーネントが存在する場合は、独自実装は避け、コレクションからコンポーネントを追加して利用します。

追加済みのコレクションは apps/blog/src/components/ui を参照。

利用可能なコレクションは以下のURLを参照:
https://ui.shadcn.com/docs/components

追加したいコンポーネントは以下のように shadcn CLI で追加する。

```bash
pnpm dlx shadcn@latest add accordion
```

## 追加したコンポーネントの利用

`@/components/ui` から import して利用する

```typescript
import { Button } from "@/components/ui/button";
```

## CSS と shadcn-ui コンポーネントの変更の禁止

- スタイリングは常に tailwindcss を利用して行うこと
  - global.css や style タグでスタイルを記述することは原則禁止
- components/ui の変更禁止
  - shadcn-ui のコンポーネントの変更は禁止
  - カスタマイズする場合は shadcn-ui を利用するコンポーネントを作成するか、独自実装すること。
