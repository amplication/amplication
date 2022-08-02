#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_FOLDER=${GITHUB_WORKSPACE:=$SCRIPT_DIR/amplication}
HELM_SERVICES_FOLDER="$ROOT_FOLDER/helm/charts/services"
IMAGE_TAG_ANCHOR=${BRANCH_NAME:=master}

for dir in /$HELM_SERVICES_FOLDER/*/
do
    echo "cleaning up $dir"
    SERVICE_NAME="$(basename $dir)"
    REPO_NAME="$SERVICE_NAME"
    echo "SERVICE_NAME: $SERVICE_NAME"
    echo "REPO_NAME: $REPO_NAME"
    set +e
    cmd="$(aws ecr describe-images --repository-name=$REPO_NAME --image-ids=imageTag=$IMAGE_TAG_ANCHOR)"
    if [ -z "$cmd" ]
    then
        echo "This branch name doesn't exist in the repository - $REPO_NAME"
        echo "::set-output name=image_exist::false"
    else
        echo "tag already exists in the repository - $REPO_NAME"
        echo "::set-output name=image_exist::true"
    fi
done
