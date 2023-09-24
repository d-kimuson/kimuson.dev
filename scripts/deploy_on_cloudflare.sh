#!/bin/bash

set -eux

pnpm i
pnpm typecheck:astro
pnpm build
