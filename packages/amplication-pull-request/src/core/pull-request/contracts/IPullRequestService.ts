import { IPullRequest } from "./IPullRequest";

export interface IPullRequestService {
  /**
   * This function creating a pull request
   */
  createPullRequest: () => IPullRequest;
}
