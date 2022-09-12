interface CommitCreated {
  buildId: string;
  commit: CommitDetails;
  pullRequest: PullRequestDetails;
  pullRequestComment: PullRequestCommentDetails;
}
