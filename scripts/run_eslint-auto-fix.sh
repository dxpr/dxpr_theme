#!/bin/bash

source scripts/run_eslint_wait.sh

npm install -g eslint

eslint js/dist --fix
