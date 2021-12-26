#!/bin/bash

set -euxo pipefail

GIT_SYNC_ENABLED=${GIT_SYNC_ENABLED:-false}
SOURCE_REPO=${SOURCE_REPO:-''}
DESTINATION_REPO=${DESTINATION_REPO:-''}

if [[ "$GIT_SYNC_ENABLED" == "true" || "$GIT_SYNC_ENABLED" == "yes" || "$GIT_SYNC_ENABLED" == "1" ]]; then
  echo "::set-output name=git_sync_enabled::true"
fi

if [[ ! -z "$SOURCE_REPO" ]]; then
  echo "::set-output name=source_repo::$SOURCE_REPO"
else
  echo "::set-output name=source_repo::dxpr/dxpr_theme"
fi

if [[ ! -z "$DESTINATION_REPO" ]]; then
  echo "::set-output name=destination_repo::$DESTINATION_REPO"
else
  echo "::set-output name=destination_repo::git@git.drupal.org:project/dxpr_theme.git"
fi
