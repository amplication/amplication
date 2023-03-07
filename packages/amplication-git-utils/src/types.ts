import { GitClient } from "./providers/git-client";

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
  installationId: string;
  clientId?: string;
  clientSecret?: string;
}

export interface GitProviderConstructorArgs {
  installationId: string;
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
  baseBranchName?: string;
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

interface LinksMetadata {
  href: string;
  name: string;
}

export interface CurrentUser {
  links: {
    avatar: LinksMetadata;
  };
  name: string;
  uuid: string;
  displayName: string;
  createdOn?: string;
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

export interface GetBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
}

export interface CreateBranchIfNotExistsArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  gitClient: GitClient;
}

export interface CreateBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  pointingSha: string;
}

export interface Commit {
  sha: string;
}

export interface GitUser {
  id: string;
  login: string;
}

export interface CloneUrlArgs {
  owner: string;
  repositoryName: string;
  token: string;
}

export interface PreCommitProcessArgs {
  gitClient: GitClient;
  branchName: string;
  owner: string;
  repositoryName: string;
}

export type PreCommitProcessResult = Promise<{
  diff: string | null;
}>;

export interface PostCommitProcessArgs {
  diffPath: string;
  gitClient: GitClient;
}

export interface FindOneIssueInput {
  owner: string;
  repositoryName: string;
  issueNumber: number;
}

interface CreatePullRequestCommentInput {
  body: string;
}

export interface CreatePullRequestCommentArgs {
  where: FindOneIssueInput;
  data: CreatePullRequestCommentInput;
}

export interface PullRequest {
  url: string;
  number: number;
}
