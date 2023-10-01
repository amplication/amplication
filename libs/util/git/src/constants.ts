export const accumulativePullRequestTitle =
  "chore(Amplication): Update Generated Code";

export const accumulativePullRequestBody = `This pull request consolidates commits from Amplication, reflecting the latest generated code. It might encompass commits from several resources or projects.

Guidelines:

1. Review and merge this PR to your default branch when ready.
2. If you encounter conflicts, resolve them and commit within this branch prior to merging
3. After merging, it's advisable to delete the Amplication branch for tidiness.
Note: Amplication will persistently push updates to this PR as long as it's open. If merged, a new PR will be created for subsequent commits.

For detailed guidance on working with Amplication and handling pull requests, please refer to our documentation - https://docs.amplication.com/sync-with-github

Best,
The Amplication Team`;

export const getDefaultREADMEFile = (repositoryName: string) => {
  return `# ${repositoryName}`;
};
