import { Octokit } from "octokit";

export abstract class BasePullRequest {
  constructor(
    protected readonly octokit: Octokit,
    protected readonly owner: string,
    protected readonly repo: string
  ) {}
}
