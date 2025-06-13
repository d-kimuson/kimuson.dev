#!/usr/bin/env bash

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "${current_branch}" == "main" ]]; then
  echo $current_branch
else
  git reflog --grep-reflog="to $()" | tac | head -n 1 | cut -d ' ' -f 6
fi
