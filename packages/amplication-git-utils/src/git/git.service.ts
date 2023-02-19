import { rm } from "fs/promises";
import { join, normalize } from "path";
import { v4 } from "uuid";
import { InvalidPullRequestMode } from "../errors/InvalidPullRequestMode";
import { MissingEnvParam } from "../errors/MissingEnvParam";
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
import { GitClient } from "./git-client";
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
      const gitClient = new GitClient();
      const cloneUrl = `https://${this.provider.domain}/${owner}/${repositoryName}.git`;

      const cloneFolder = process.env.CLONES_FOLDER;

      if (!cloneFolder) {
        throw new MissingEnvParam("CLONES_FOLDER");
      }

      const randomUUID = v4();

      const cloneDir = normalize(
        join(cloneFolder, this.provider.name, owner, repositoryName, randomUUID)
      );

      await gitClient.clone(cloneUrl, cloneDir);

      await this.restoreAmplicationBranchIfNotExists({
        owner,
        repositoryName,
        branchName,
        gitClient,
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

      await rm(cloneDir, { recursive: true, force: true });

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
    const { branchName, owner, repositoryName, gitClient } = args;
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
        gitClient,
        branchName,
        firstCommitOnDefaultBranch,
      });
      return branch;
    }
    return branch;
  }

  private async cherryPickCommits(args: CherryPickCommitsArgs) {
    const { gitClient, commits, branchName, firstCommitOnDefaultBranch } = args;
    await gitClient.resetState();
    await gitClient.checkout(branchName);

    for (let index = commits.length - 1; index >= 0; index--) {
      const commit = commits[index];
      if (firstCommitOnDefaultBranch.sha === commit.sha) {
        continue;
      }
      await gitClient.cherryPick(commit.sha);
    }

    await gitClient.git.push();
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
