import { Injectable } from "@nestjs/common";
import {
  GitClient,
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
} from "../types";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitFactory } from "./git-factory";

@Injectable()
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
    getRepositoryArgs: GetRepositoryArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getRepository(getRepositoryArgs);
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepos> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getRepositories(getRepositoriesArgs);
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitRepository> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.createRepository(createRepositoryArgs);
  }

  async deleteGitOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<boolean> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.deleteGitOrganization();
  }

  async getOrganization(
    gitProviderArgs: GitProviderArgs
  ): Promise<RemoteGitOrganization> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getOrganization();
  }

  async getFile(
    file: File,
    gitProviderArgs: GitProviderArgs
  ): Promise<GithubFile> {
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    return gitProvider.getFile(file);
  }

  async createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs,
    gitProviderArgs: GitProviderArgs
  ): Promise<string> {
    const { owner, repositoryName, pullRequestModule, gitResourceMeta } =
      createPullRequestArgs;
    const gitProvider = this.gitFactory.getProvider(gitProviderArgs);
    const files = await prepareFilesForPullRequest(
      owner,
      repositoryName,
      gitResourceMeta,
      pullRequestModule
    );
    return gitProvider.createPullRequest(createPullRequestArgs, files);
  }
}
