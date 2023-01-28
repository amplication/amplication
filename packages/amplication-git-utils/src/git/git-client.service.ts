import {
  CreateRepository,
  GitClient,
  GithubFile,
  GitProviderArgs,
  Pagination,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  Repository,
  File,
} from "../types";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitFactory } from "./git-factory";

export class GitClientService implements GitClient {
  constructor(private readonly gitFactory: GitFactory) {}

  async getGitInstallationUrl(
    amplicationWorkspaceId: string,
    gitProviderArgs: GitProviderArgs
  ): Promise<string> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async getRepository(
    repository: Repository,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getRepository(repository);
  }

  async getRepositories(
    pagination: Pagination,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepos> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getRepositories(pagination);
  }

  async createRepository(
    createRepository: CreateRepository,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.createRepository(createRepository);
  }

  async deleteGitOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<boolean> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.deleteGitOrganization();
  }

  async getGitRemoteOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitOrganization> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getGitRemoteOrganization();
  }

  async getFile(
    file: File,
    gitProviderArgs: GitProviderArgs
  ): Promise<GithubFile> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getFile(file);
  }

  async createPullRequest(
    pullRequest: PullRequest,
    gitProviderArgs: GitProviderArgs
  ): Promise<string> {
    const { owner, repositoryName, pullRequestModule, gitResourceMeta } =
      pullRequest;
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    const files = await prepareFilesForPullRequest(
      owner,
      repositoryName,
      gitResourceMeta,
      pullRequestModule
    );
    return gitProvider.createPullRequest(pullRequest, files);
  }
}
