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

export interface GitClient {
  getRepository(options: Options): Promise<RemoteGitRepository>;
  getRepositories(options: Options): Promise<RemoteGitRepos>;
  createRepository(options: Options): Promise<RemoteGitRepository>;
  deleteGitOrganization(options: Options): Promise<boolean>;
  getGitRemoteOrganization(options: Options): Promise<RemoteGitOrganization>;
  getFile(options: Options): Promise<GithubFile>;
  createPullRequest(options: Options): Promise<string>;
  getGitInstallationUrl(options: Options): Promise<string>;
}
