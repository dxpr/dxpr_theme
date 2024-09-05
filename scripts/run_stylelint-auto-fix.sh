#!/bin/bash

set -euxo pipefail

source scripts/run_eslint_wait.sh

# Stylelint scope
PATHS=(scss)

npx stylelint "${PATHS[@]}" --fix
