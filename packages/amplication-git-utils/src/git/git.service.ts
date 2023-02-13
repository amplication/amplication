import {
  GitProviderArgs,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  GetRepositoryArgs,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
  CreatePullRequestArgs,
  GitProvider,
  EnumPullRequestMode,
} from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitFactory } from "./git-factory";

export class GitClientService {
  private provider: GitProvider;

  async create(gitProviderArgs: GitProviderArgs): Promise<GitClientService> {
    this.provider = await GitFactory.getProvider(gitProviderArgs);
    return this;
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.provider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async getAuthByTemporaryCode(code: string): Promise<unknown> {
    return this.provider.getAuthByTemporaryCode(code);
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

  async createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs
  ): Promise<string> {
    const {
      owner,
      repositoryName,
      branchName,
      commitMessage,
      pullRequestTitle,
      pullRequestBody,
      pullRequestMode,
      gitResourceMeta,
      files,
    } = createPullRequestArgs;
    const amplicationIgnoreManger = await this.manageAmplicationIgnoreFile(
      owner,
      repositoryName
    );
    const preparedFiles = await prepareFilesForPullRequest(
      gitResourceMeta,
      files,
      amplicationIgnoreManger
    );

    if (pullRequestMode === EnumPullRequestMode.Basic) {
      return this.provider.createPullRequestFromFiles({
        owner,
        repositoryName,
        branchName,
        commitMessage,
        pullRequestTitle,
        pullRequestBody,
        files: preparedFiles,
      });
    }

    if (pullRequestMode === EnumPullRequestMode.Accumulative) {
      await this.provider.createBranchIfNotExists({
        owner,
        repositoryName,
        branchName,
      }),
        await this.provider.createCommit({
          owner,
          repositoryName,
          commitMessage,
          branchName,
          files: preparedFiles,
        });
      const { defaultBranch } = await this.provider.getRepository({
        owner,
        repositoryName,
      });
      const existingPullRequest = await this.provider.getPullRequestForBranch({
        owner,
        repositoryName,
        branchName,
      });
      if (!existingPullRequest) {
        return this.provider.createPullRequestForBranch({
          owner,
          repositoryName,
          pullRequestTitle,
          pullRequestBody,
          branchName,
          defaultBranchName: defaultBranch,
        });
      }
      return existingPullRequest.url;
    }
  }

  private async manageAmplicationIgnoreFile(owner, repositoryName) {
    const amplicationIgnoreManger = new AmplicationIgnoreManger();
    await amplicationIgnoreManger.init(async (fileName) => {
      try {
        const file = await this.provider.getFile({
          owner,
          repositoryName,
          path: fileName,
          baseBranchName: undefined, // take the default branch
        });
        const { content, htmlUrl, name } = file;
        console.log(`Got ${name} file ${htmlUrl}`);
        return content;
      } catch (error) {
        console.log("Repository does not have a .amplicationignore file");
        return "";
      }
    });
    return amplicationIgnoreManger;
  }
}
