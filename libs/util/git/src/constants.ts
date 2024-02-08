export const accumulativePullRequestTitle =
  "chore(Amplication): Update Generated Code";

export const accumulativePullRequestBody = `If you're looking to bring in a new data model, tweak existing ones, handle APIs, or spice things up with Amplication plugins, just swing by the Amplication platform at $link_to_service. Tell us what you need, and we'll handle all the coding magic for you.

**Note: In case there are any conflicts, please resolve them on this branch before merging the PR.**

Please keep in mind that this branch should not be deleted. Amplication will continue to push new commits to this PR as long as it remains open. If this PR has already been merged, we will open a new PR for the next commit.

For more information on how to work with Amplication and manage pull requests, please refer to our documentation - [https://docs.amplication.com/sync-with-github](https://docs.amplication.com/sync-with-github)

The Amplication Team`;

export const getDefaultREADMEFile = (repositoryName: string) => {
  return `# ${repositoryName}`;
};
