import {
  Branch,
  CloneUrlArgs,
  Commit,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  GitProviderCreatePullRequestArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GitProviderGetPullRequestArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  Bot,
  OAuthData,
  PaginatedGitGroup,
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
  getCurrentOAuthUser(accessToken: string): Promise<CurrentUser>;
  getAccessToken(authorizationCode: string): Promise<OAuthData>;
  refreshAccessToken(refreshToken: string): Promise<OAuthData>;
  getGitGroups(): Promise<PaginatedGitGroup>;
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
  getPullRequest: (
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ) => Promise<PullRequest | null>;
  createPullRequest: (
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ) => Promise<PullRequest>;
  getBranch: (args: GetBranchArgs) => Promise<Branch | null>;
  createBranch: (args: CreateBranchArgs) => Promise<Branch>;
  getFirstCommitOnBranch: (args: GetBranchArgs) => Promise<Commit>;
  getCloneUrl: (args: CloneUrlArgs) => string;
  createPullRequestComment: (
    args: CreatePullRequestCommentArgs
  ) => Promise<void>;
  getToken(): Promise<string>;
  getAmplicationBotIdentity(): Promise<Bot | null>;
}
