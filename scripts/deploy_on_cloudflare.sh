#!/bin/bash

set -eux

pnpm i --frozen-lockfile
ENV=production pnpm build
