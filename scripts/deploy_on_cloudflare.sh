#!/bin/bash

set -eux

BUILD_ENV="production"
if [[ "$CF_PAGES_BRANCH" != "master" ]]; then
  BUILD_ENV="preview"
fi

echo "Start deploy script for $BUILD_ENV"

echo "env:"
printenv

echo "Generate codes."
pnpm --filter=@kimuson.dev/articles generate

echo "build for $BUILD_ENV"
ENV=$BUILD_ENV pnpm build
