REPO_NAME=${GITHUB_REPOSITORY##*/}
echo "REPO_NAME: $REPO_NAME"
if [ "$REPO_NAME" = "amplication" ]; then
    if [[ "$GITHUB_REF" != 'refs/heads/master' ]]; then
        ECR_REPOSITORY_PREFIX="dev-staging-os"
    else
        ECR_REPOSITORY_PREFIX="-staging-os"
    fi
else
    if [[ "$GITHUB_REF" != 'refs/heads/master' ]]; then
        ECR_REPOSITORY_PREFIX="dev"
    fi  
fi
echo "ECR_REPOSITORY=${SERVICE_NAME}${ECR_REPOSITORY_PREFIX}" >> $GITHUB_ENV
echo "ECR_REPOSITORY: $ECR_REPOSITORY"