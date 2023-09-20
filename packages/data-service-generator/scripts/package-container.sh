#!/usr/bin/env bash

IMAGE_REPO='439403303254.dkr.ecr.us-east-1.amazonaws.com/data-service-generator'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$SCRIPT_DIR/../../../

cd $ROOT_DIR

export GIT_REF_NAME=${GIT_REF_NAME:-"latest-local"}
export GIT_SHA=${GIT_SHA:-"🦄-sha"}

if [[ $PRODUCTION_TAGS = "true" ]]; then
    echo "Production deployment detected"
    echo "Overriding INPUT_TAGS with data-service-generator package version"

    PACKAGE_VERSION=$(cat $SCRIPT_DIR/../package.json | jq -r '.version')
    # prefix with `v` to match other container image tags
    IMAGE_TAG="v$PACKAGE_VERSION"
    export INPUT_TAGS="$IMAGE_REPO:$IMAGE_TAG,$IMAGE_REPO:sha-${GIT_SHA:0:7}"

    npx nx internal:package:container data-service-generator --prod
else
    npx nx internal:package:container data-service-generator 
fi
