import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";

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

export interface Options {
  provider?: EnumGitProvider;
  gitOrganization?: RemoteGitOrganization;
  pullRequestMode?: EnumPullRequestMode;
  repositoryUrl?: string;
  repositoryName?: string;
  isPrivateRepository?: boolean;
  installationId?: string;
  organization?: string;
  owner?: string;
  files?: Required<Changes["files"]>;
  commit?: Commit;
  pullRequestTitle?: string;
  pullRequestBody?: string;
  baseBranch?: string;
  author?: string;
  filePath?: string;
  gitResourceMeta?: GitResourceMeta;
  pullRequestModule?: PullRequestModule[];
  amplicationWorkspaceId?: string;
  limit?: number;
  page?: number;
  head?: string;
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

export interface CreatePullRequest {
  title: string;
  body: string;
  head: string;
  base?: string | undefined;
}

export interface GithubFile {
  name: string | null;
  path: string | null;
  content: string;
  htmlUrl: string | null;
}

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface Repository {
  owner: string;
  repositoryName: string;
}

export interface CreateRepository {
  gitOrganization: RemoteGitOrganization;
  owner: string;
  repositoryName: string;
  isPrivateRepository: boolean;
}

export interface Pagination {
  limit: number;
  page: number;
}

export interface File {
  owner: string;
  repositoryUrl: string;
  baseBranch: string;
  path: string;
}

export interface PullRequest {
  pullRequestMode: EnumPullRequestMode;
  owner: string;
  repositoryName: string;
  pullRequestModule: PullRequestModule;
  commit: Commit;
  pullRequestTitle: string;
  pullRequestBody: string;
  head: string;
  gitResourceMeta: GitResourceMeta;
}

export interface GitClient {
  getGitInstallationUrl(
    amplicationWorkspaceId: string,
    gitProviderArgs: GitProviderArgs
  ): Promise<string>;
  getRepository(
    repository: Repository,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository>;
  getRepositories(
    pagination: Pagination,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepos>;
  createRepository(
    createRepository: CreateRepository,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository>;
  deleteGitOrganization(gitProviderArgs: GitProviderArgs): Promise<boolean>;
  getGitRemoteOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitOrganization>;
  getFile(file: File, gitProviderArgs: GitProviderArgs): Promise<GithubFile>;
  createPullRequest(
    pullRequest: PullRequest,
    gitProviderArgs: GitProviderArgs
  ): Promise<string>;
}
