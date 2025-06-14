# OGP 生成機能

## 概要

- **場所**: `apps/blog/src/scripts/ogp-generator/`
- **出力先**: `apps/blog/public/ogp/`（ディレクトリ構造を維持）
- **画像仕様**: 1200x630px、白文字、BizinGothicNFフォント、初期サイズ150px

## アセット要件

- **背景画像**: `apps/blog/assets/ogp_background.png`
- **フォント**: `apps/blog/assets/fonts/BizinGothicNF-Regular.ttf`

## 使用方法

```bash
# 全記事の一括生成
pnpm ogp --batch

# 強制再生成
pnpm ogp --batch --force

# 単一記事生成
pnpm ogp <記事ファイルパス>
```

## 技術詳細

- **依存関係**: budoux, canvas, gray-matter, glob, tsx
- **テキスト分割**: BudouXによる日本語適応改行（最大30文字/行、6行まで）
- **ファイル名**: 記事パス構造を維持（例: `Python/venv_jupyter.png`）
- **メタデータ**: Next.js App Router の generateMetadata でOGP設定済み

## 重要な実装ポイント

- 記事のfrontmatterから `title` プロパティを取得（`Title` ではない）
- TypeScriptでfrontmatterアクセス時は `frontmatter["title"]` 形式を使用
- 既存ファイルは自動スキップ（`--force`で強制上書き）
- ディレクトリ構造を `public/ogp/` 以下に完全再現
