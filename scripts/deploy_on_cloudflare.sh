#!/bin/bash

set -eux

pnpm i --frozen-lockfile
pnpm build
