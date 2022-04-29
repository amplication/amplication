#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TARGET_ENV=${TARGET_ENV:=dev}
OUTPUT_PATH=${OUTPUT_PATH:=versions.yaml}
ROOT_FOLDER=${GITHUB_WORKSPACE:=$SCRIPT_DIR/amplication}
HELM_SERVICES_FOLDER="$ROOT_FOLDER/helm/charts/services"
IMAGE_TAG_ANCHOR=${SOURCE_BRANCH:=feature-aws-cd}
echo "" > $OUTPUT_PATH
for dir in /$HELM_SERVICES_FOLDER/*/
do
    SERVICE_NAME="${${dir%*/}##*/}"
    REPO_NAME="$SERVICE_NAME-$TARGET_ENV"
    echo "SERVICE_NAME: $SERVICE_NAME"
    tag_list=$(aws ecr describe-images --repository-name $REPO_NAME --image-ids imageTag=$IMAGE_TAG_ANCHOR --region us-east-1 2>&1 | jq -r '.imageDetails[0].imageTags' | jq -r '.[]')
    echo "tag_list: $tag_list"
    while IFS= read -r line; do
        re='^[0-9]+$'
        if [[ $line =~ $re ]] ; then
            echo "$SERVICE_NAME:" >> $OUTPUT_PATH
            echo "  deployment:" >> $OUTPUT_PATH
            echo "    image:" >> $OUTPUT_PATH
            echo "      tag: $line" >> $OUTPUT_PATH
            break
        fi
    done <<< "$tag_list"    
done
