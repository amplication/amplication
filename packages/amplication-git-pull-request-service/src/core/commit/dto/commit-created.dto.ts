import { CommitDetailsDto } from './commit-details.dto';
import { PullRequestDetailsDto } from './pull-request-details.dto';
import { PullRequestCommentDetailsDto } from './pull-request-comment-details.dto';

export class CommitCreatedDto {
  buildId: string;
  commit: CommitDetailsDto;
  pullRequest: PullRequestDetailsDto;
  pullRequestComment: PullRequestCommentDetailsDto;
}
