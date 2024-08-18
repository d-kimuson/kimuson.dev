#!/bin/bash

set -eux

rtx i
corepack enable
corepack prepare pnpm@9.7.1 --activate
pnpm i
