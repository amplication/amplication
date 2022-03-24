/**
 * This interface is declaring a class that when its created it will be create a new pull request in her constructor
 */
export interface IPullRequest {
  create: () => IPullRequest;
}
