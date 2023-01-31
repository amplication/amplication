export type PullRequestModule = {
  path: string;
  code: string | null;
};

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

export interface File {
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
  pullRequestModule: PullRequestModule[];
}

export interface CreatePullRequestFromFiles {
  owner: string;
  repositoryName: string;
  branchName: string; // head
  commitMessage: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  files: any | any[];
}

export interface CreateBranchIfNotExistsArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
}

export interface GetPullRequestFomBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
}

export interface CreatePullRequestFomBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  defaultBranchName: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  pullRequestUrl: string;
}

export interface CreateCommitArgs {
  owner: string;
  repositoryName: string;
  commitMessage: string;
  branchName: string;
  changes: any | any[];
}

export interface GitProvider {
  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string>;
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
  getFile(file: File): Promise<GitFile>;
  createPullRequestFromFiles: (
    createPullRequestFromFiles: CreatePullRequestFromFiles
  ) => Promise<string>;
  createBranchIfNotExists: (
    createBranchIfNotExistsArgs: CreateBranchIfNotExistsArgs
  ) => Promise<Branch>;
  createCommit: (createCommitArgs: CreateCommitArgs) => Promise<void>;
  // getRepository: () => Promise<any>
  getPullRequestForBranch: (
    getPullRequestFomBranchArgs: GetPullRequestFomBranchArgs
  ) => Promise<{ url: string; number: number } | undefined>;
  createPullRequestForBranch: (
    createPullRequestForBranch: CreatePullRequestFomBranchArgs
  ) => Promise<string>;
}
