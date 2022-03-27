import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IPullRequestRouter } from "./contracts";
import { SendPullRequestArgs } from "./dto";
import { PullRequestService } from "./pull-request.service";
import { PullRequest } from "./pullRequest";

@Resolver((of) => PullRequest)
export class PullRequestResolver implements IPullRequestRouter {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @Mutation((returns) => PullRequest, { nullable: false })
  createPullRequest(@Args() args: SendPullRequestArgs) {
    return this.pullRequestService.createPullRequest();
  }
}
