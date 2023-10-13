#!/bin/bash

set -eux

# example: packages="backend frontend"
packages=""

nodenv install -s
corepack enable
corepack prepare pnpm@8.9.0 --activate
nodenv rehash

pnpm i

for package in $packages; do
  cd packages/$package
  nodenv install -s
  pnpm i
  cd -
done
