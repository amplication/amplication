export class NoChangesOnPullRequest extends Error {
  constructor(public readonly pullRequestUrl: string) {
    super(`No changes in the current pull request`);
  }
}
