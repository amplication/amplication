import {
  Branch,
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  GitProviderCreatePullRequestArgs,
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
  OAuthTokens,
  PaginatedGitGroup,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  getFolderContentArgs,
  GitFolderContent,
} from "./types";

export interface GitProvider {
  readonly name: EnumGitProvider;
  readonly domain: string;
  init(): Promise<void>;
  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string>;
  getCurrentOAuthUser(
    accessToken: string,
    state?: string,
    amplicationWorkspaceId?: string
  ): Promise<CurrentUser>;
  getOAuthTokens(authorizationCode: string): Promise<OAuthTokens>;
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
  getFolderContent(args: getFolderContentArgs): Promise<GitFolderContent>;
  getPullRequest: (
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ) => Promise<PullRequest | null>;
  createPullRequest: (
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ) => Promise<PullRequest | null>;
  getBranch: (args: GetBranchArgs) => Promise<Branch | null>;
  createBranch: (args: CreateBranchArgs) => Promise<Branch>;
  getCloneUrl: (args: CloneUrlArgs) => Promise<string>;
  createPullRequestComment: (
    args: CreatePullRequestCommentArgs
  ) => Promise<void>;
  getAmplicationBotIdentity(): Promise<Bot | null>;

  getAuthData(): Promise<OAuthTokens | null>;
  isAuthDataRefreshed(): Promise<boolean>;
}
