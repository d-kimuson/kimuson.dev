#!/bin/bash

set -eux

printenv

npm i -g pnpm@8.6.3
pnpm i --frozen-lockfile
pnpm build
