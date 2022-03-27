import { SendPullRequestArgs } from "../dto";
import { PullRequest } from "../pullRequest";

export interface IPullRequestRouter {
  createPullRequest(args: SendPullRequestArgs): PullRequest;
}
