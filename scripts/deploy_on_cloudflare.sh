#!/bin/bash

set -eux

pnpm i --frozen-lockfile
pnpm astro sync
pnpm build
