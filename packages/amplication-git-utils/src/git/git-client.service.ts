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

  getRepositories(
    pagination: Pagination,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepos> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getRepositories(pagination);
  }

  createRepository(
    createRepository: CreateRepository,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.createRepository(createRepository);
  }

  deleteGitOrganization(gitProviderArgs: GitProviderArgs): Promise<boolean> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.deleteGitOrganization();
  }

  getGitRemoteOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitOrganization> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getGitRemoteOrganization();
  }

  getFile(file: File, gitProviderArgs: GitProviderArgs): Promise<GithubFile> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getFile(file);
  }

  createPullRequest(
    pullRequest: PullRequest,
    gitProviderArgs: GitProviderArgs
  ): Promise<string> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.createPullRequest(pullRequest);
  }
}
