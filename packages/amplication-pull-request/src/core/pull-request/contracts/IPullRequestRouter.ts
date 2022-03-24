import { IPullRequest } from "./IPullRequest";

export interface IPullRequestRouter {
  createPullRequest: () => IPullRequest;
}
