#!/bin/bash

set -eux

corepack prepare pnpm@8.6.3 --activate
pnpm i --frozen-lockfile
pnpm build
