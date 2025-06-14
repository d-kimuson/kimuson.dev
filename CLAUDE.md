# kimuson.dev 開発ガイド

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
- `pnpm ogp --batch` - 全記事のOGP画像生成（ルートから実行）
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

## OGP画像生成システム

### 概要

- **場所**: `apps/blog/src/scripts/ogp-generator/`
- **出力先**: `apps/blog/public/ogp/`（ディレクトリ構造を維持）
- **画像仕様**: 1200x630px、白文字、BizinGothicNFフォント、初期サイズ150px

### アセット要件

- **背景画像**: `apps/blog/assets/ogp_background.png`
- **フォント**: `apps/blog/assets/fonts/BizinGothicNF-Regular.ttf`

### 使用方法

```bash
# 全記事の一括生成
pnpm ogp --batch

# 強制再生成
pnpm ogp --batch --force

# 単一記事生成
pnpm ogp <記事ファイルパス>
```

### 技術詳細

- **依存関係**: budoux, canvas, gray-matter, glob, tsx
- **テキスト分割**: BudouXによる日本語適応改行（最大30文字/行、6行まで）
- **ファイル名**: 記事パス構造を維持（例: `Python/venv_jupyter.png`）
- **メタデータ**: Next.js App Router の generateMetadata でOGP設定済み

### 重要な実装ポイント

- 記事のfrontmatterから `title` プロパティを取得（`Title` ではない）
- TypeScriptでfrontmatterアクセス時は `frontmatter["title"]` 形式を使用
- 既存ファイルは自動スキップ（`--force`で強制上書き）
- ディレクトリ構造を `public/ogp/` 以下に完全再現
