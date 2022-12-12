import { BranchMeta } from "./dto/branch-meta.dto";
import { PullRequestMeta } from "./dto/pull-request-meta.dto";

export interface GitProvider {
  createRepository(_private: boolean): Promise<string>;

  deleteRepository(): Promise<string>;

  getDefaultBranchName(): Promise<string>;

  commit(
    branch: string,
    message: string,
    files: { path: string; content: string }[],
    headCommit: string
  ): Promise<string>;

  deleteBranch(branch: string): Promise<boolean>;

  createBranch(branch: string, headCommit: string): Promise<string>;

  getBranch(branch: string): Promise<BranchMeta>;

  getRepository(): Promise<{ private: boolean }>;

  getOpenedPullRequest(branch: string): Promise<PullRequestMeta>;

  createPullRequest(
    title: string,
    body: string,
    branch: string,
    base: string
  ): Promise<PullRequestMeta>;

  updatePullRequest(number: number, open: boolean): Promise<void>;

  addPullRequestComment(
    pullRequestNumber: number,
    body: string
  ): Promise<string>;
}
