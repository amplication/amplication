REPO_NAME_TEMP=${GITHUB_REPOSITORY}
REPO_NAME=${REPO_NAME##*/}
echo "REPO_NAME: $REPO_NAME"
if [ "$REPO_NAME" = "amplication" ]; then
if [[ $GITHUB_REF != 'refs/heads/master' ]]; then
    ECR_REPOSITORY_PREFIX="dev-staging-os"
else
    ECR_REPOSITORY_PREFIX="-staging-os"
fi
else
if [[ $GITHUB_REF != 'refs/heads/master' ]]; then
    ECR_REPOSITORY_PREFIX="dev"
fi  
fi
echo "ECR_REPOSITORY=${{ matrix.service }}${ECR_REPOSITORY_PREFIX}" >> $GITHUB_ENV
echo "ECR_REPOSITORY: $ECR_REPOSITORY"