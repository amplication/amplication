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

export interface Commit {
  title: string;
  body: string;
  base?: string | undefined;
  head?: string | undefined;
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
  pullRequestMode: EnumPullRequestMode;
  owner: string;
  repositoryName: string;
  pullRequestModule: PullRequestModule[];
  commit: Commit;
  pullRequestTitle: string;
  pullRequestBody: string;
  head: string;
  gitResourceMeta: GitResourceMeta;
}

export interface CreateGitPullRequest {
  title: string;
  body: string;
  head: string;
  base?: string | undefined;
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
  createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs,
    files: any | any[]
  ): Promise<string>;
}
