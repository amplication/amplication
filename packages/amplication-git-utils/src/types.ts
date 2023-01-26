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

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface GitClient {
  createUserRepository(
    installationId: string,
    owner: string,
    name: string,
    isPublic: boolean
  ): Promise<RemoteGitRepository>;

  createOrganizationRepository(
    installationId: string,
    owner: string,
    name: string,
    isPublic: boolean
  ): Promise<RemoteGitRepository>;

  getOrganizationRepos(
    installationId: string,
    limit: number,
    page: number
  ): Promise<RemoteGitRepos>;

  isRepoExist(installationId: string, name: string): Promise<boolean>;

  getGitInstallationUrl(workspaceId: string): Promise<string>;

  deleteGitOrganization(installationId: string): Promise<boolean>;

  getGitRemoteOrganization(
    installationId: string
  ): Promise<RemoteGitOrganization>;

  getFile(
    userName: string,
    repoName: string,
    path: string,
    baseBranchName: string,
    installationId: string
  ): Promise<GithubFile>;

  createPullRequest(
    mode: EnumPullRequestMode,
    userName: string,
    repoName: string,
    modules: Required<Changes["files"]>,
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    installationId: string,
    head: string
  ): Promise<string>;

  getRepository(
    installationId: string,
    owner: string,
    repo: string
  ): Promise<RemoteGitRepository>;
}
