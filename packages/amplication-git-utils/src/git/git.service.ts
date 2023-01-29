import {
  GithubFile,
  GitProviderArgs,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  File,
  GetRepositoryArgs,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
  CreatePullRequestArgs,
  GitProvider,
} from "../types";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitFactory } from "./git-factory";

export class GitClientService {
  private provider: GitProvider;

  static createProvider(gitProviderArgs: GitProviderArgs): GitClientService {
    const serviceInstance = new this();
    serviceInstance.provider = GitFactory.getProvider(gitProviderArgs);
    return serviceInstance;
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.provider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    return this.provider.getRepository(getRepositoryArgs);
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    return this.provider.getRepositories(getRepositoriesArgs);
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    return this.provider.createRepository(createRepositoryArgs);
  }

  async deleteGitOrganization(): Promise<boolean> {
    return this.provider.deleteGitOrganization();
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    return this.provider.getOrganization();
  }

  async getFile(file: File): Promise<GithubFile> {
    return this.provider.getFile(file);
  }

  async createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs
  ): Promise<string> {
    const { owner, repositoryName, pullRequestModule, gitResourceMeta } =
      createPullRequestArgs;
    const files = await prepareFilesForPullRequest(
      owner,
      repositoryName,
      gitResourceMeta,
      pullRequestModule
    );
    return this.provider.createPullRequest(createPullRequestArgs, files);
  }
}
