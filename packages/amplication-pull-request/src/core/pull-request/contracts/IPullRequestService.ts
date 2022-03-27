import { PullRequest } from '../pullRequest';

export interface IPullRequestService {
  /**
   * This function creating a pull request
   */
  createPullRequest(): PullRequest;
}
