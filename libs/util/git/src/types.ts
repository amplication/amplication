import { GitCli } from "./providers/git-cli";

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
  AwsCodeCommit = "AwsCodeCommit",
}

export interface BitBucketConfiguration {
  clientId: string;
  clientSecret: string;
}

export interface GitHubConfiguration {
  clientId: string;
  clientSecret: string;
  appId: string;
  privateKey: string;
  installationUrl: string;
}

export interface GitProvidersConfiguration {
  gitHubConfiguration: GitHubConfiguration;
  bitBucketConfiguration: BitBucketConfiguration;
}
export type GitProviderProperties =
  | GitHubProviderOrganizationProperties
  | OAuthProviderOrganizationProperties
  | AwsCodeCommitProviderOrganizationProperties;

export interface OAuthProviderOrganizationProperties
  extends OAuthTokens,
    CurrentUser {}

export const isOAuthProviderOrganizationProperties = (
  properties: unknown
): properties is OAuthProviderOrganizationProperties => {
  const castedProperties = properties as OAuthProviderOrganizationProperties;
  if (
    !(
      castedProperties.accessToken !== undefined &&
      castedProperties.refreshToken !== undefined &&
      castedProperties.expiresAt !== undefined &&
      castedProperties.useGroupingForRepositories !== undefined &&
      castedProperties.username !== undefined
    )
  ) {
    throw new Error(
      "Missing mandatory param. Bitbucket provider requires OAuth configuration"
    );
  }
  return true;
};

export interface GitHubProviderOrganizationProperties {
  installationId: string;
}

export const isGitHubProviderOrganizationProperties = (
  properties: unknown
): properties is GitHubProviderOrganizationProperties => {
  if (
    !(
      (properties as GitHubProviderOrganizationProperties).installationId !==
      undefined
    )
  ) {
    throw new Error(
      "Missing mandatory param. Github provider requires installationId"
    );
  }
  return true;
};

export interface GitProviderArgs {
  provider: EnumGitProvider;
  providerOrganizationProperties: GitProviderProperties;
}

export interface AwsCodeCommitProviderOrganizationProperties {
  gitCredentials: {
    username: string;
    password: string;
  };
  sdkCredentials: {
    accessKeyId: string;
    accessKeySecret: string;
    region?: string;
  };
}

export const isAwsCodeCommitProviderOrganizationProperties = (
  properties: unknown
): properties is AwsCodeCommitProviderOrganizationProperties => {
  const castedProperties =
    properties as AwsCodeCommitProviderOrganizationProperties;
  if (
    !(
      castedProperties.gitCredentials.username !== undefined &&
      castedProperties.gitCredentials.password !== undefined &&
      castedProperties.sdkCredentials.accessKeyId !== undefined &&
      castedProperties.sdkCredentials.accessKeySecret !== undefined
    )
  ) {
    throw new Error(
      "Missing mandatory param. AWS CodeCommit provider requires HTTPS Git credentials and Access Keys"
    );
  }
  return true;
};

export interface GitProviderConstructorArgs {
  installationId: string;
}

export interface Pagination {
  page: number;
  perPage: number;
}

export interface RemoteGitOrganization {
  name: string;
  type: EnumGitOrganizationType;
  useGroupingForRepositories: boolean;
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
  groupName?: string | null;
}

export interface RemoteGitRepos {
  repos: RemoteGitRepository[];
  total: number | null;
  pagination: Pagination;
}

export type File = {
  path: string;
  content: string | null;
};

export type UpdateFile = {
  path: string;
  content: string | null;
  skipIfExists: boolean;
  deleted: boolean;
};

export type UpdateFileFn = ({ exists }: { exists: boolean }) => string | null;

export interface GitFile {
  name: string | null;
  path: string | null;
  content: string;
}

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface GetRepositoryArgs {
  owner: string;
  repositoryName: string;
  groupName?: string;
}

export interface CreateRepositoryArgs {
  gitOrganization: RemoteGitOrganization;
  owner: string;
  repositoryName: string;
  isPrivate: boolean;
  groupName?: string;
}

export interface GetRepositoriesArgs {
  pagination: Pagination;
  groupName?: string;
}

export interface GetFileArgs {
  owner: string;
  repositoryName: string;
  repositoryGroupName?: string;
  path: string;
  /**
   * Revision reference of the file to request.
   * It can be a branch name, commit SHA, git tag.
   * Default: default branch name HEAD
   */
  ref?: string;
}

export interface CreatePullRequestArgs {
  owner: string;
  repositoryName: string;
  repositoryGroupName?: string;
  branchName: string;
  commitMessage: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  pullRequestMode: EnumPullRequestMode;
  gitResourceMeta: GitResourceMeta;
  files: File[];
  cloneDirPath: string;
  resourceId: string;
  buildId: string;
  baseBranchName: string;
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

export interface GitProviderGetPullRequestArgs {
  owner: string;
  repositoryName: string;
  repositoryGroupName?: string;
  branchName: string;
}

export interface GitProviderCreatePullRequestArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  baseBranchName: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  repositoryGroupName?: string;
}

export interface LinksMetadata {
  href: string;
  name: string;
}

export interface CurrentUser {
  links: {
    avatar: LinksMetadata;
  };
  username: string;
  uuid: string;
  displayName: string;
  useGroupingForRepositories: boolean;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: number; // Unix timestamp
  scopes: string[];
}

export interface OAuth2FlowArgs {
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedGitGroup {
  total: number;
  page: number;
  pageSize: number;
  next: string;
  previous: string;
  groups: GitGroup[];
}

export interface GitGroup {
  id: string;
  displayName: string;
  name: string;
}

export interface GetBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  repositoryGroupName?: string;
}

export interface CreateBranchIfNotExistsArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  gitCli: GitCli;
  baseBranch: string;
  repositoryGroupName?: string;
}

export interface CreateBranchArgs {
  owner: string;
  repositoryName: string;
  branchName: string;
  pointingSha: string;
  repositoryGroupName?: string;
  baseBranchName: string;
}

export interface Commit {
  sha: string;
}

export interface Bot {
  id: string;
  login: string;
  gitAuthor: string;
}

export interface CloneUrlArgs {
  owner: string;
  repositoryName: string;
  repositoryGroupName?: string;
}

export interface CalculateDiffAndResetBranchArgs {
  gitCli: GitCli;
  branchName: string;
  useBeforeLastCommit: boolean;
}

export type CalculateDiffAndResetBranchResult = Promise<{
  diff: string | null;
}>;

export interface PostCommitProcessArgs {
  diffFolder: string;
  diff: string;
  gitCli: GitCli;
}

export interface FindOneIssueInput {
  owner: string;
  repositoryName: string;
  repositoryGroupName?: string;
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
