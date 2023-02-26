export enum EnumPullRequestMode {
  Basic = "Basic",
  Accumulative = "Accumulative",
}

export enum EnumGitOrganizationType {
  User = "User",
  Organization = "Organization",
}

export enum EnumGitProvider {
  Github = "Github",
  Bitbucket = "Bitbucket",
}

export interface GitProviderArgs {
  provider: EnumGitProvider;
  installationId: string | null;
}

export interface RemoteGitOrganization {
  name: string;
  type: EnumGitOrganizationType;
}

export interface Branch {
  name: string;
  sha: string;
}

export interface RemoteGitRepository {
  name: string | null;
  url: string | null;
  private: boolean | null;
  fullName: string | null;
  admin: boolean | null;
  defaultBranch: string;
}

export interface RemoteGitRepos {
  repos: RemoteGitRepository[];
  totalRepos: number | null;
  currentPage: number | null;
  pageSize: number | null;
}

export type File = {
  path: string;
  content: string | null;
};

export type UpdateFile = {
  path: string;
  content: string | null | UpdateFileFn;
};

export type UpdateFileFn = ({ exists }: { exists: boolean }) => string | null;

export interface GitFile {
  name: string | null;
  path: string | null;
  content: string;
  htmlUrl: string | null;
}

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface GetRepositoryArgs {
  owner: string;
  repositoryName: string;
}

export interface CreateRepositoryArgs {
  gitOrganization: RemoteGitOrganization;
  owner: string;
  repositoryName: string;
  isPrivateRepository: boolean;
}

export interface GetRepositoriesArgs {
  limit: number;
  page: number;
}

export interface GetFileArgs {
  owner: string;
  repositoryName: string;
  baseBranchName: string;
  path: string;
}

export interface CreatePullRequestArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  commitMessage: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  pullRequestMode: EnumPullRequestMode;
  gitResourceMeta: GitResourceMeta;
  files: File[];
}

export interface CreatePullRequestFromFilesArgs {
  owner: string;
  repositoryName: string;
  branchName: string; // head
  commitMessage: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  files: UpdateFile[];
}

export interface CreateBranchIfNotExistsArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
}

export interface GetPullRequestForBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
}

export interface CreatePullRequestForBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  defaultBranchName: string;
  pullRequestTitle: string;
  pullRequestBody: string;
}

export interface CreateCommitArgs {
  owner: string;
  repositoryName: string;
  commitMessage: string;
  branchName: string;
  files: UpdateFile[];
}

export interface CurrentUser {
  links: {
    avatar: {
      href: string;
      name: string;
    };
  };
  username: string;
  uuid: string;
  displayName: string;
  createdOn: string;
}

export interface OAuthData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scopes: string[];
}

export interface OAuth2FlowResponse extends OAuthData {
  userData: CurrentUser;
}

export interface GitProvider {
  init(): Promise<void>;
  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string>;
  getAccessToken(authorizationCode: string): Promise<OAuth2FlowResponse>;
  refreshAccessToken(refreshToken: string): Promise<OAuthData>;
  getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository>;
  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos>;
  createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository>;
  deleteGitOrganization(): Promise<boolean>;
  getOrganization(): Promise<RemoteGitOrganization>;
  getFile(file: GetFileArgs): Promise<GitFile>;
  createPullRequestFromFiles: (
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ) => Promise<string>;
  createBranchIfNotExists: (
    createBranchIfNotExistsArgs: CreateBranchIfNotExistsArgs
  ) => Promise<Branch>;
  createCommit: (createCommitArgs: CreateCommitArgs) => Promise<void>;
  getPullRequestForBranch: (
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ) => Promise<{ url: string; number: number } | undefined>;
  createPullRequestForBranch: (
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ) => Promise<string>;
}
