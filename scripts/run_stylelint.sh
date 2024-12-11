#!/bin/bash

set -euxo pipefail

source scripts/run_eslint_wait.sh

# Stylelint scope
PATHS=(scss)

# Create stylelint-report.html for easier tracing and fixing.
if [ "$REPORT_ENABLED" = 'true' ]; then
  npx stylelint "${PATHS[@]}" -f compact -o out/stylelint-report.txt || true
  echo "stylelint-report.html created"
fi

# Should always display the stylelint check on the console.
npx stylelint "${PATHS[@]}"
