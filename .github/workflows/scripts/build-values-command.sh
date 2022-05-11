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
    REPO_NAME=${GITHUB_REPOSITORY##*/}
    echo "REPO_NAME: $REPO_NAME"
    if [ "$REPO_NAME" = "amplication" ]; then
        echo "Will use dev prefix"
        REPO_SUFFIX="dev"
    else
        echo "Will use prod prefix"
        REPO_SUFFIX="prod" 
    fi
    REPO_NAME="$SERVICE_NAME-$REPO_SUFFIX"
    echo "SERVICE_NAME: $SERVICE_NAME"
    echo "REPO_NAME: $REPO_NAME"
    tag_list="$(aws ecr describe-images --repository-name=$REPO_NAME --region us-east-1 --image-ids=imageTag=$IMAGE_TAG_ANCHOR 2> /dev/null )"
    image_tags=$(echo $tag_list | jq -r '.imageDetails[0].imageTags' 2>&1)
    echo "tag_list: $tag_list"
    echo "image_tags: $image_tags"
    
    echo "$IMAGE_TAG_ANCHOR" > found_tag
    while IFS= read -r line; do
        re='^[0-9]+$'
        echo "$line" > fallback_tag
        if [[ $line =~ $re ]] ; then
          echo "$line" > found_tag
        fi
    done <<< "$image_tags"
    
    FOUND_TAG=$(cat found_tag)
    if [ -z "$FOUND_TAG" ]
    then
      FOUND_TAG=$(cat fallback_tag)
      echo "using fallback tag: $FOUND_TAG"
    else
      echo "FOUND_TAG: $FOUND_TAG"
    fi
    if ! [ -z "$VERSIONS" ]
    then
      VERSIONS+=" "
    fi

    VERSIONS+="-p $SERVICE_NAME.deployment.image.tag=$FOUND_TAG"
done
echo "$VERSIONS" >> $OUTPUT_PATH
echo "VERSIONS=$VERSIONS" >> $GITHUB_ENV


