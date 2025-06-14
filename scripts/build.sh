#!/usr/bin/env bash
# このデプロイスクリプトは事前にビルドされている前提で動作する

set -euo pipefail

cwd=$(pwd)
cd $(git rev-parse --show-toplevel) # リポジトリトップ

pnpm --filter @kimuson.dev/articles generate:summary
pnpm --filter @kimuson.dev/blog generate:ogp
pnpm --filter @kimuson.dev/blog build

cd $cwd
