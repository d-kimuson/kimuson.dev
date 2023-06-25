#!/bin/bash

set -eux

echo "[DEBUG] start setup"

./scripts/setup.sh

echo "[DEBUG] complete setup"

pnpm build

echo "[DEBUG] complete build"
