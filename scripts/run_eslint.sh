#!/bin/bash

source scripts/run_eslint_wait.sh

npm install -g eslint

# create eslint-report.htlm for easier tracing and fixing
if [ "$REPORT_ENABLED" = 'true' ]; then
  eslint js/dist -f node_modules/eslint-detailed-reporter/lib/detailed.js -o out/eslint-report.html
  echo "eslint-report.html created"
fi


eslint js/dist
