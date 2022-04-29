#!/bin/bash
TAGS="${TAG_LIST:=latest}"
echo "TAGS=$TAGS"
echo "ECR_REPOSITORY=$ECR_REPOSITORY"
echo "MANIFEST: $MANIFEST"

for tag in $(echo $TAGS | sed "s/,/ /g")
do
    echo "fixing tag: $tag"
    fixed_tag=$(echo $tag | sed 's/[^a-zA-Z0-9]/-/g')
    echo "fixed_tag: $fixed_tag"
    echo "aws ecr put-image --repository-name $ECR_REPOSITORY --image-tag $fixed_tag --image-manifest $MANIFEST"
    (aws ecr put-image --repository-name $ECR_REPOSITORY --image-tag $fixed_tag --image-manifest "$MANIFEST")&>$GITHUB_WORKSPACE/tag_result
    retag_response=$(cat $GITHUB_WORKSPACE/tag_result)
    echo "retag_response: $retag_response"
    if [[ $retag_response == *"already exists in the repository with name"* ]]; then
        echo "Already exists in the repository with name: $fixed_tag"
    else
        if [[ $retag_response == *"error"* ]] || [[ $retag_response == *"ERROR"* ]]; then
            echo "Failed to re tag docker $fixed_tag \n $retag_response"
            exit -1
        fi
    fi
done