#!/bin/sh

IMAGE_REPO='439403303254.dkr.ecr.us-east-1.amazonaws.com/data-service-generator'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/../../../

if [[ -z "$INPUT_TAGS" ]]; then
    echo "Local environment detected"

    echo "INPUT_TAGS not set, skipping container build"
    npx nx internal:package:container data-service-generator

elif [[ $INPUT_TAGS == *":next"* ]] || [[ $INPUT_TAGS == *":master"* ]]; then
    echo "Sandbox / Staging deployment detected"
    # check if INPUT_TAGS contains a `next` or `master` tag
    echo "Skipping container build for next or master branch"
    npx nx internal:package:container data-service-generator --prod
    
else
    echo "Production deployment detected"
    echo "Overriding INPUT_TAGS with data-service-generator package version"

    PACKAGE_VERSION=$(cat $SCRIPT_DIR/../package.json | jq -r '.version')
    # prefix with `v` to match other container image tags
    IMAGE_TAG="v$PACKAGE_VERSION"
    INPUT_TAGS="$IMAGE_REPO:$IMAGE_TAG,$IMAGE_REPO:sha-$GIT_SHA"
    npx nx internal:package:container data-service-generator --prod
fi


