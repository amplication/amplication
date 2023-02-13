import { InvalidPullRequestMode } from "../errors/InvalidPullRequestMode";
import { GitProvider } from "../git-provider.interface.ts";
import {
  Branch,
  CherryPickCommitsArgs,
  CreateBranchIfNotExistsArgs,
  CreatePullRequestArgs,
  CreateRepositoryArgs,
  EnumPullRequestMode,
  GetRepositoriesArgs,
  GitProviderArgs,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitFactory } from "./git-factory";
import { GitClient } from "./git-client";

export class GitClientService {
  private provider: GitProvider;
  async create(gitProviderArgs: GitProviderArgs): Promise<GitClientService> {
    this.provider = await GitFactory.getProvider(gitProviderArgs);
    return this;
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.provider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    return this.provider.getRepositories(getRepositoriesArgs);
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
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
      const localRepository = new GitClient({
        owner,
        provider: this.provider.name,
        repo: repositoryName,
      });
      await localRepository.init();
      await this.restoreAmplicationBranchIfNotExists({
        owner,
        repositoryName,
        branchName,
        clone: localRepository,
      });
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

    throw new InvalidPullRequestMode();
  }

  private async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const { branchName, owner, repositoryName, clone } = args;
    const branch = await this.provider.getBranch(args);
    if (!branch) {
      const { defaultBranch } = await this.provider.getRepository(args);
      const firstCommitOnDefaultBranch =
        await this.provider.getFirstCommitOnBranch({
          owner,
          repositoryName,
          branchName: defaultBranch,
        });
      const branch = await this.provider.createBranch({
        owner,
        branchName,
        repositoryName,
        pointingSha: firstCommitOnDefaultBranch.sha,
      });
      const amplicationCommits = await this.provider.getCurrentUserCommitList({
        owner,
        repositoryName,
        branchName: defaultBranch,
      });
      await this.cherryPickCommits({
        commits: amplicationCommits,
        clone,
        branchName,
        firstCommitOnDefaultBranch,
      });
      return branch;
    }
    return branch;
  }

  private async cherryPickCommits(args: CherryPickCommitsArgs) {
    const { clone, commits, branchName, firstCommitOnDefaultBranch } = args;
    await clone.git.fetch(["--all"]);
    await clone.git.pull();
    await clone.git.reset();
    await clone.git.checkout(branchName);

    for (let index = commits.length - 1; index >= 0; index--) {
      const commit = commits[index];
      if (firstCommitOnDefaultBranch.sha === commit.sha) {
        continue;
      }
      await clone.git.raw([
        `cherry-pick`,
        "-m 1",
        "--strategy=recursive",
        "-X",
        "theirs",
        commit.sha,
      ]);
    }

    await clone.git.push();
  }

  private async manageAmplicationIgnoreFile(owner, repositoryName) {
    const amplicationIgnoreManger = new AmplicationIgnoreManger();
    await amplicationIgnoreManger.init(async (fileName) => {
      try {
        const file = await this.provider.getFile({
          owner,
          repositoryName,
          path: fileName,
        });
        if (!file) {
          return "";
        }
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
