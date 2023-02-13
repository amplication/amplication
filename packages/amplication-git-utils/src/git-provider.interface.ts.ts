import {
  Branch,
  Commit,
  CreateBranchArgs,
  CreateCommitArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GetPullRequestForBranchArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "./types";

export interface GitProvider {
  readonly name: EnumGitProvider;
  readonly domain: string;
  init(): Promise<void>;
  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string>;
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
  createPullRequestFromFiles: (
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ) => Promise<string>;
  createCommit: (createCommitArgs: CreateCommitArgs) => Promise<void>;
  getPullRequestForBranch: (
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ) => Promise<{ url: string; number: number } | undefined>;
  createPullRequestForBranch: (
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ) => Promise<string>;
  getBranch: (args: GetBranchArgs) => Promise<Branch | null>;
  createBranch: (args: CreateBranchArgs) => Promise<Branch>;
  getFirstCommitOnBranch: (args: GetBranchArgs) => Promise<Commit>;
  getCurrentUserCommitList: (args: GetBranchArgs) => Promise<Commit[]>;
}
