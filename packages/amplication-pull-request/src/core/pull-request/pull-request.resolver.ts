import { Args, Query, Resolver } from '@nestjs/graphql';
import { SendPullRequestArgs } from './dto';
import { PullRequestService } from './pull-request.service';
import { PullRequest } from './pullRequest';

@Resolver((of) => PullRequest)
export class PullRequestResolver {
  constructor(private readonly pullRequestService: PullRequestService) {}

  //TODO refactor to mutation
  @Query((returns) => PullRequest, { nullable: false })
  async createPullRequest(@Args() args: SendPullRequestArgs) {
    return this.pullRequestService.createPullRequest(args);
  }
}
