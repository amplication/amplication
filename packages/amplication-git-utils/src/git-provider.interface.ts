import {
  Branch,
  CloneUrlArgs,
  Commit,
  CreateBranchArgs,
  CreateCommitArgs,
  CreatePullRequestCommentArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GetPullRequestForBranchArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  OAuth2FlowResponse,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "./types";

export interface GitProvider {
  readonly name: EnumGitProvider;
  readonly domain: string;
  init(): Promise<void>;
  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string>;
  completeOAuth2Flow(authorizationCode: string): Promise<OAuth2FlowResponse>;
  getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository>;
  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos>;
  createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null>;
  deleteGitOrganization(): Promise<boolean>;
  getOrganization(): Promise<RemoteGitOrganization>;
  getFile(file: GetFileArgs): Promise<GitFile | null>;
  createPullRequestFromFiles: (
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ) => Promise<string>;
  createCommit: (createCommitArgs: CreateCommitArgs) => Promise<void>;
  getPullRequestForBranch: (
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ) => Promise<PullRequest | null>;
  createPullRequestForBranch: (
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ) => Promise<PullRequest>;
  getBranch: (args: GetBranchArgs) => Promise<Branch | null>;
  createBranch: (args: CreateBranchArgs) => Promise<Branch>;
  getFirstCommitOnBranch: (args: GetBranchArgs) => Promise<Commit>;
  getCurrentUserCommitList: (args: GetBranchArgs) => Promise<Commit[]>;
  getCloneUrl: (args: CloneUrlArgs) => string;
  commentOnPullRequest: (args: CreatePullRequestCommentArgs) => Promise<void>;
  getToken(): Promise<string>;
}
