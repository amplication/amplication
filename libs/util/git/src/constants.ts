export const accumulativePullRequestTitle =
  "chore(Amplication): Update Generated Code";

export const accumulativePullRequestBody = `This pull request includes multiple commits by Amplication with the latest generated code.
The pull request may also include commits from several resources and/or projects.
You can safely merge this pull request to your default branch.

**Note: In case there are any conflicts, please resolve them on this branch before merging the PR.**

Please keep in mind that this branch should not be deleted. Amplication will continue to push new commits to this PR as long as it remains open. If this PR has already been merged, we will open a new PR for the next commit.

For more information on how to work with Amplication and manage pull requests, please refer to our documentation - [https://docs.amplication.com/sync-with-github](https://docs.amplication.com/sync-with-github)

The Amplication Team`;

export const getDefaultREADMEFile = (repositoryName: string) => {
  return `# ${repositoryName}`;
};
