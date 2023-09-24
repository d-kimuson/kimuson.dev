#!/bin/bash

set -eux

# npm i -g pnpm@8.6.3
pnpm i --frozen-lockfile
pnpm build
