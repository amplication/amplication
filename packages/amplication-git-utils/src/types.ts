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
  repositoryUrl: string;
  baseBranch: string;
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
  getFile(file: File): Promise<GithubFile>;
  createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs,
    files: Required<Changes["files"]>
  ): Promise<string>;
}

export interface GitClient {
  getGitInstallationUrl(
    amplicationWorkspaceId: string,
    gitProviderArgs: GitProviderArgs
  ): Promise<string>;
  getRepository(
    getRepositoryArgs: GetRepositoryArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository>;
  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepos>;
  createRepository(
    createRepositoryArgs: CreateRepositoryArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository>;
  deleteGitOrganization(gitProviderArgs: GitProviderArgs): Promise<boolean>;
  getOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitOrganization>;
  getFile(file: File, gitProviderArgs: GitProviderArgs): Promise<GithubFile>;
  createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<string>;
}
