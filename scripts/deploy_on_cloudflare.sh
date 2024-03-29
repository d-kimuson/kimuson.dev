#!/bin/bash

set -eux

printenv

BUILD_ENV="production"
if [[ "$CF_PAGES_BRANCH" != "master" ]]; then
  BUILD_ENV="preview"
fi

echo "Start build for $BUILD_ENV"

ENV=$BUILD_ENV pnpm build
