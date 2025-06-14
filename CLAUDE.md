# kimuson.dev 開発ガイド

## プロジェクト構成

- `apps/blog/` - Next.js製ブログアプリケーション
- `packages/articles/` - 記事管理パッケージ（Markdown解析・サマリー生成）
- `packages/tsconfig/` - 共通TypeScript設定

## ビルド・テストコマンド

- `pnpm dev` - 開発環境の起動
- `pnpm build` - すべてのパッケージをビルド
- `pnpm typecheck` - TypeScript型チェックの実行
- `pnpm lint` - すべてのリンターを実行（prettier, cspell, turbo lint）
- `pnpm fix` - 自動修正可能なリント問題を修正
- `cd packages/articles && pnpm generate` - 記事サマリーの生成
- `pnpm ogp --batch` - 全記事のOGP画像生成（ルートから実行）
- `cd apps/blog && pnpm ogp --batch` - 全記事のOGP画像生成（apps/blogから実行）

## コードスタイルガイドライン

### TypeScript

- 型インポートを使用、型アサーションと明示的な`any`を避ける
- 未使用変数はアンダースコアプレフィックス（例: `_unused`）
- `interface`より`type`を優先、メソッド署名よりプロパティ署名を優先
- Promise拒否を処理、浮遊Promiseは禁止
- Nullish合体演算子（`??`）を論理OR演算子（`||`）より優先

### フォーマット（Prettier）

- インデント: 2スペース（タブなし）
- クォート: ダブルクォート
- セミコロン: 使用
- 末尾カンマ: ES5準拠

### インポート順序

1. ビルトインモジュール
2. サードパーティ
3. 型インポート
4. 内部モジュール
5. 親ディレクトリ
6. インデックス
7. 同階層

### その他

- コメント: スペース付き（`// このように`）
- パッケージマネージャ: pnpm v9.7.1以上を使用
- package.json の直接編集は禁止。必ず pnpm add と pnpm add -D を使って追加してください。

このプロジェクトはTurboとpnpmワークスペースを使用したモノレポです。リポジトリルートからコマンドを実行してください。

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
