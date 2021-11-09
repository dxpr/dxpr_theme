#!/bin/bash

set -euxo pipefail

source scripts/run_eslint_wait.sh

# create eslint-report.htlm for easier tracing and fixing
if [ "$REPORT_ENABLED" = 'true' ]; then
  TIMING=1 npx eslint js/dist -f node_modules/eslint-detailed-reporter/lib/detailed.js -o out/eslint-report.html || true
  echo "eslint-report.html created"
fi

# always run this to display the errors on console
TIMING=1 npx eslint js/dist
