import { mkdir, rm, writeFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { v4 } from "uuid";
import {
  accumulativePullRequestBody,
  accumulativePullRequestTitle,
} from "../constants";
import { InvalidPullRequestMode } from "../errors/InvalidPullRequestMode";
import { MissingEnvParam } from "../errors/MissingEnvParam";
import { GitProvider } from "../git-provider.interface";
import {
  Branch,
  Commit,
  CreateBranchIfNotExistsArgs,
  CreatePullRequestArgs,
  CreateRepositoryArgs,
  EnumPullRequestMode,
  GetRepositoriesArgs,
  GitProviderArgs,
  PostCommitProcessArgs,
  PreCommitProcessArgs,
  PreCommitProcessResult,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  GetRepositoryArgs,
  PaginatedGitGroup,
  GitProvidersConfiguration,
  CurrentUser,
  OAuthData,
} from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitClient } from "./git-client";
import { GitFactory } from "./git-factory";
import { ILogger } from "@amplication/util/logging";
import { LogResult } from "simple-git";

export class GitClientService {
  private provider: GitProvider;
  private logger: ILogger;

  private getAmplicationGitUser(): {
    name: string;
    email: string;
  } {
    return {
      name: "amplication",
      email: "bot@amplication.com",
    };
  }

  async create(
    gitProviderArgs: GitProviderArgs,
    providersConfiguration: GitProvidersConfiguration,
    logger: ILogger
  ): Promise<GitClientService> {
    this.provider = await GitFactory.getProvider(
      gitProviderArgs,
      providersConfiguration,
      logger
    );
    this.logger = logger;
    return this;
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.provider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async getAccessToken(authorizationCode: string): Promise<OAuthData> {
    return this.provider.getAccessToken(authorizationCode);
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthData> {
    return this.provider.refreshAccessToken(refreshToken);
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    return this.provider.getCurrentOAuthUser(accessToken);
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    return this.provider.getGitGroups();
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
      gitGroupName,
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

    this.logger.info(`Got a ${pullRequestMode} pull request mode`);
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
      const cloneFolder = process.env.CLONES_FOLDER;
      if (!cloneFolder) {
        throw new MissingEnvParam("CLONES_FOLDER");
      }

      const randomUUID = v4();
      const cloneToken = await this.provider.getToken();

      const cloneUrl = this.provider.getCloneUrl({
        owner,
        repositoryName,
        token: cloneToken,
        gitGroupName,
      });

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

      const { diff } = await this.preCommitProcess({
        branchName,
        gitClient,
      });

      await this.provider.createCommit({
        owner,
        author: this.getAmplicationGitUser(),
        repositoryName,
        commitMessage,
        branchName,
        files: preparedFiles,
        gitGroupName,
      });

      if (diff) {
        const diffFolder = normalize(
          join(
            `.amplication/diffs`,
            this.provider.name,
            owner,
            repositoryName,
            randomUUID
          )
        );
        await this.postCommitProcess({
          diffFolder,
          diff,
          gitClient,
        });
      }

      await rm(cloneDir, { recursive: true, force: true });

      const { defaultBranch } = await this.provider.getRepository({
        owner,
        repositoryName,
      });

      const existingPullRequest = await this.provider.getPullRequest({
        owner,
        repositoryName,
        branchName,
      });

      let pullRequest = existingPullRequest;

      if (!pullRequest) {
        pullRequest = await this.provider.createPullRequest({
          owner,
          repositoryName,
          pullRequestTitle: accumulativePullRequestTitle,
          pullRequestBody: accumulativePullRequestBody,
          branchName,
          defaultBranchName: defaultBranch,
        });
      }

      await this.provider.commentOnPullRequest({
        where: {
          issueNumber: pullRequest.number,
          owner,
          repositoryName,
          gitGroupName,
        },
        data: { body: pullRequestBody },
      });

      return pullRequest.url;
    }

    throw new InvalidPullRequestMode();
  }

  /**
   * Returns git commits by amplication author
   * @param gitClient Git client
   * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
   */
  private async gitLogByAuthor(
    gitClient: GitClient,
    maxCount = -1
  ): Promise<{
    amplicationGitUser: LogResult;
    amplicationBot: LogResult | null;
  }> {
    const amplicationBot = await this.provider.getAmplicationBotIdentity();

    let lastAmplicationBotCommitOnBranch: LogResult | null = null;

    if (amplicationBot) {
      const amplicationBotLoginRegex = amplicationBot.login.replace(
        /([[\]])/g,
        "\\$1"
      );

      lastAmplicationBotCommitOnBranch = await gitClient.git.log({
        "--author": amplicationBotLoginRegex,
        "--max-count": maxCount,
      });
    }

    const lastAmplicationGitUserCommitOnBranch = await gitClient.git.log({
      "--author": `${this.getAmplicationGitUser().name} <${
        this.getAmplicationGitUser().email
      }>`,
      "--max-count": maxCount,
    });

    return {
      amplicationGitUser: lastAmplicationGitUserCommitOnBranch,
      amplicationBot: lastAmplicationBotCommitOnBranch,
    };
  }

  /**
   * Return the git diff of the latest amplication commit in the branchName.
   * Return null when no amplication commits are found in the branch.
   */
  async preCommitProcess({
    gitClient,
    branchName,
  }: PreCommitProcessArgs): PreCommitProcessResult {
    this.logger.info("Pre commit process");
    await gitClient.git.checkout(branchName);

    const { amplicationGitUser, amplicationBot } = await this.gitLogByAuthor(
      gitClient,
      1
    );
    if (
      (!amplicationGitUser || !amplicationGitUser.latest) &&
      (!amplicationBot || !amplicationBot.latest)
    ) {
      this.logger.info(
        "Didn't find a commit that has been created by Amplication"
      );
      return { diff: null };
    }

    const hash =
      amplicationGitUser.latest?.hash || amplicationBot?.latest?.hash;
    if (!hash) {
      this.logger.info("Didn't find a commit hash");
      return { diff: null };
    }
    const diff = await gitClient.git.diff([hash]);
    if (!diff) {
      this.logger.info("Diff returned empty");
      return { diff: null };
    }
    // Reset the branch to the latest commit of the user / bot
    await gitClient.git.reset([hash]);
    await gitClient.git.push(["--force"]);
    await gitClient.resetState();
    this.logger.info("Diff returned");
    return { diff };
  }

  /**
   * @param diff File containing the git diff
   * @param diffFolder Location where the git patch will be generated
   * @param gitClient
   */
  private async postCommitProcess({
    diff,
    diffFolder,
    gitClient,
  }: PostCommitProcessArgs) {
    await mkdir(diffFolder, { recursive: true });
    const diffPatchRelativePath = join(diffFolder, "diff.patch");
    await writeFile(diffPatchRelativePath, diff);
    const diffPatchAbsolutePath = resolve(diffPatchRelativePath);
    this.logger.info(`Saving diff to: ${diffPatchAbsolutePath}`);

    await gitClient.resetState();
    await gitClient.git
      .applyPatch(diffPatchAbsolutePath, ["--3way", "--whitespace=nowarn"])
      .add(["."])
      .commit("Amplication diff restoration", undefined, {
        "--author": "Amplication diff <info@amplication.com>",
      })
      .push();

    await rm(diffPatchAbsolutePath);
  }

  private async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const { branchName, owner, repositoryName, gitClient, gitGroupName } = args;
    const branch = await this.provider.getBranch(args);
    if (branch) {
      return branch;
    }
    const { defaultBranch } = await this.provider.getRepository(args);
    const firstCommitOnDefaultBranch =
      await this.provider.getFirstCommitOnBranch({
        owner,
        repositoryName,
        branchName: defaultBranch,
        gitGroupName,
      });
    const newBranch = await this.provider.createBranch({
      owner,
      branchName,
      repositoryName,
      pointingSha: firstCommitOnDefaultBranch.sha,
    });

    const { amplicationGitUser, amplicationBot } = await this.gitLogByAuthor(
      gitClient
    );

    await this.cherryPickCommits(
      { ...amplicationBot, ...amplicationGitUser },
      gitClient,
      branchName,
      firstCommitOnDefaultBranch
    );
    return newBranch;
  }

  private async cherryPickCommits(
    commitsFromLatest: LogResult,
    gitClient: GitClient,
    branchName: string,
    firstCommitOnDefaultBranch: Commit
  ) {
    await gitClient.resetState();
    await gitClient.checkout(branchName);

    for (let index = commitsFromLatest.total - 1; index >= 0; index--) {
      const commit = commitsFromLatest.all[index];
      if (firstCommitOnDefaultBranch.sha === commit.hash) {
        continue;
      }
      await gitClient.cherryPick(commit.hash);
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
        this.logger.info(`Got ${name} file ${htmlUrl}`);
        return content;
      } catch (error) {
        this.logger.info("Repository does not have a .amplicationignore file");
        return "";
      }
    });
    return amplicationIgnoreManger;
  }
}
