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

このプロジェクトはTurboとpnpmワークスペースを使用したモノレポです。リポジトリルートからコマンドを実行してください。
