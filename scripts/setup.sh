#!/bin/bash

set -eux

rtx i
corepack enable
corepack prepare pnpm@8.13.1 --activate
pnpm i
