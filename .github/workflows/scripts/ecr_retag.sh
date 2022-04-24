TAGS="${TAG_LIST:=latest}"
echo "TAGS=$TAGS"
echo "ECR_REPOSITORY=$ECR_REPOSITORY"
echo "MANIFEST: $MANIFEST"

for tag in $(echo $TAGS | sed "s/,/ /g")
do
    fixed_tag=$(echo $tag | sed 's/[^a-zA-Z0-9]/-/g')
    command="aws ecr put-image --repository-name $ECR_REPOSITORY --image-tag $fixed_tag --image-manifest $MANIFEST"
    echo "$command"
    $command
done


