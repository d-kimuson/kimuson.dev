# kimuson.dev 開発ガイド

## 行動指針

- 常に **日本語で** 会話すること
- ユーザーからフィードバックを受けた際には、再発防止策として CLAUDE.md を更新する (複数回の再発 -$100)

## プロジェクト構成

- `apps/blog/` - Next.js製ブログアプリケーション
- `packages/articles/` - 記事管理パッケージ（Markdown解析・サマリー生成）
- `packages/tsconfig/` - 共通TypeScript設定

## ビルド・テストコマンド

- `pnpm build` - すべてのパッケージをビルド
- `pnpm typecheck` - TypeScript型チェックの実行
- `pnpm lint` - すべてのリンターを実行（prettier, cspell, turbo lint）
- `pnpm fix` - 自動修正可能なリント問題を修正
- `cd packages/articles && pnpm generate` - 記事サマリーの生成
- `cd apps/blog && pnpm ogp --batch` - 全記事のOGP画像生成（apps/blogから実行）

## 動作確認

### 静的チェック

1. `pnpm typecheck` - TypeScript型チェック
2. `pnpm fix` - 自動修正可能なLint問題を修正 (pnpm lint は基本使用しない)
3. 手動でLintエラーがあれば対応

### アプリケーションの動作確認

**重要**: Claude Code では `pnpm dev` は使用不可。代わりに以下の手順で動作確認を行う：

```bash
# ビルドとVRTスクリーンショット生成を実行
pnpm build && pnpm --filter=@kimuson.dev/blog vrt:capture
```

- **スクリーンショット出力先**: `apps/blog/vrt/screenshots/`
- **確認対象**: 生成されたスクリーンショットで各ページが正常に表示されているかを確認可能

## 開発ガイドライン

### プロジェクト固有ルール

- package.json の直接編集は禁止。必ず `pnpm add` と `pnpm add -D` を使用
- 記事のfrontmatterから `title` プロパティを取得（`Title` ではない）
- TypeScriptでfrontmatterアクセス時は `frontmatter["title"]` 形式を使用

**注意**: このプロジェクトはTurboとpnpmワークスペースを使用したモノレポです。リポジトリルートからコマンドを実行してください。

### スタイルの記述方法

スタイルを記述する際には docs/style.md を参照し、規約に則り実装を行うこと。

## OGP画像生成システム

OGP 画像の生成については docs/ogp.md を参照すること。
