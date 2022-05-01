#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TARGET_ENV=${TARGET_ENV:=dev}
OUTPUT_PATH=${OUTPUT_PATH:=versions.command}
ROOT_FOLDER=${GITHUB_WORKSPACE:=$SCRIPT_DIR/amplication}
HELM_SERVICES_FOLDER="$ROOT_FOLDER/helm/charts/services"
IMAGE_TAG_ANCHOR=${SOURCE_BRANCH_NAME:=master}
touch $OUTPUT_PATH
for dir in /$HELM_SERVICES_FOLDER/*/
do
    echo "cleaning up $dir"
    SERVICE_NAME="$(basename $dir)"
    REPO_NAME="$SERVICE_NAME-$TARGET_ENV"
    echo "SERVICE_NAME: $SERVICE_NAME"
    tag_list=$(aws ecr describe-images --repository-name $REPO_NAME --image-ids imageTag=$IMAGE_TAG_ANCHOR --region us-east-1 2>&1 | jq -r '.imageDetails[0].imageTags' | jq -r '.[]')
    echo "tag_list: $tag_list"
    VERSIONS=""
    
    echo "$IMAGE_TAG_ANCHOR" > found_tag
    while IFS= read -r line; do
        re='^[0-9]+$'
        echo "$line" > fallback_tag
        if [[ $line =~ $re ]] ; then
          echo "$line" > found_tag
        fi
    done <<< "$tag_list"
    
    FOUND_TAG=$(cat found_tag)
    if [ -z "$FOUND_TAG" ]
    then
      FOUND_TAG=$(cat fallback_tag)
      echo "using fallback tag: $FOUND_TAG"
    else
      echo "FOUND_TAG: $FOUND_TAG"
    fi
    VERSIONS+="-p $SERVICE_NAME.deployment.image.tag=$FOUND_TAG"
done
echo "$VERSIONS" >> $OUTPUT_PATH
echo "VERSIONS=$VERSIONS" >> $GITHUB_ENV


