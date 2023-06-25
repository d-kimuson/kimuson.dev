#!/bin/bash

set -eux

./scripts/setup.sh
pnpm build
