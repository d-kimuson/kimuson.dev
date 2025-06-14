#!/usr/bin/env bash
# このデプロイスクリプトは事前にビルドされている前提で動作する

set -euo pipefail

# 引数チェック
if [ $# -ne 1 ]; then
  echo "Usage: $0 <production|preview>"
  echo "  production: Deploy to production environment"
  echo "  preview: Deploy to preview environment"
  exit 1
fi

ENVIRONMENT=$1

# 有効な環境かチェック
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "preview" ]; then
  echo "Error: Invalid environment '$ENVIRONMENT'. Must be 'production' or 'preview'"
  echo "Usage: $0 <production|preview>"
  exit 1
fi

cwd=$(pwd)
cd $(git rev-parse --show-toplevel) # リポジトリトップ

pnpm --filter @kimuson.dev/articles generate:summary
pnpm --filter @kimuson.dev/blog generate:ogp

# 環境に応じたデプロイ実行
case "$ENVIRONMENT" in
  "production")
    echo "Deploying to production environment..."
    pnpm --filter @kimuson.dev/blog deploy:production
    ;;
  "preview")
    echo "Deploying to preview environment..."
    pnpm --filter @kimuson.dev/blog deploy:preview
    ;;
esac

cd $cwd
