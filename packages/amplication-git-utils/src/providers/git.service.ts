import { ILogger } from "@amplication/util/logging";
import { mkdir, rm, writeFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { v4 } from "uuid";
import {
  accumulativePullRequestBody,
  accumulativePullRequestTitle,
  getDefaultREADMEFile,
} from "../constants";
import { InvalidPullRequestMode } from "../errors/InvalidPullRequestMode";
import { NoCommitOnBranch } from "../errors/NoCommitOnBranch";
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
  OAuthTokens,
  UpdateFile,
} from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { isFolderEmpty } from "../utils/is-folder-empty";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitCli } from "./git-cli";
import { GitFactory } from "./git-factory";
import { LogResult } from "simple-git";

export class GitClientService {
  private provider: GitProvider;
  private logger: ILogger;

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

  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    return this.provider.getOAuthTokens(authorizationCode);
  }

  async refreshAccessToken(): Promise<OAuthTokens> {
    return this.provider.refreshAccessToken();
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
      repositoryGroupName,
      branchName,
      commitMessage,
      pullRequestTitle,
      pullRequestBody,
      pullRequestMode,
      gitResourceMeta,
      files,
      cloneDirPath,
      buildId,
      resourceId,
    } = createPullRequestArgs;

    const gitRepoDir = normalize(
      join(
        cloneDirPath,
        this.provider.name,
        owner,
        repositoryGroupName
          ? join(repositoryGroupName, repositoryName)
          : repositoryName,
        `${resourceId}-${buildId}`
      )
    );
    const cloneUrl = await this.provider.getCloneUrl({
      owner,
      repositoryName,
      repositoryGroupName,
    });

    const gitCli = new GitCli(this.logger, {
      originUrl: cloneUrl,
      repositoryDir: gitRepoDir,
    });

    try {
      const { defaultBranch } = await this.provider.getRepository({
        owner,
        repositoryName,
        groupName: repositoryGroupName,
      });

      const haveFirstCommitInDefaultBranch =
        await this.isHaveFirstCommitInDefaultBranch({
          owner,
          repositoryName,
          repositoryGroupName,
          defaultBranch,
        });

      if (haveFirstCommitInDefaultBranch === false) {
        await gitCli.clone();
        await this.createInitialCommit({
          gitRepoDir,
          gitCli,
          repositoryName,
          defaultBranch,
        });
      }

      const amplicationIgnoreManger = await this.manageAmplicationIgnoreFile(
        owner,
        repositoryName,
        repositoryGroupName
      );

      const preparedFiles = await prepareFilesForPullRequest(
        gitResourceMeta,
        files,
        amplicationIgnoreManger
      );

      this.logger.info(`Got a ${pullRequestMode} pull request mode`);

      let pullRequestUrl: string | null = null;

      switch (pullRequestMode) {
        case EnumPullRequestMode.Basic:
          pullRequestUrl = await this.provider.createPullRequestFromFiles({
            owner,
            repositoryName,
            branchName,
            commitMessage,
            pullRequestTitle,
            pullRequestBody,
            files: preparedFiles,
          });
          break;
        case EnumPullRequestMode.Accumulative:
          pullRequestUrl = await this.accumulativePullRequest({
            gitCli,
            owner,
            repositoryName,
            branchName,
            commitMessage,
            pullRequestBody,
            preparedFiles,
            defaultBranch,
            repositoryGroupName,
          });
          break;
        default:
          throw new InvalidPullRequestMode();
      }

      await gitCli.deleteRepositoryDir();

      return pullRequestUrl;
    } catch (error) {
      await gitCli.deleteRepositoryDir();

      throw error;
    }
  }

  async accumulativePullRequest(options: {
    gitCli: GitCli;
    owner: string;
    repositoryName: string;
    branchName: string;
    commitMessage: string;
    pullRequestBody: string;
    preparedFiles: UpdateFile[];
    defaultBranch: string;
    repositoryGroupName?: string;
  }): Promise<string> {
    const {
      gitCli,
      owner,
      repositoryName,
      branchName,
      commitMessage,
      pullRequestBody,
      preparedFiles,
      defaultBranch,
      repositoryGroupName,
    } = options;

    await gitCli.clone();
    await this.restoreAmplicationBranchIfNotExists({
      owner,
      repositoryName,
      repositoryGroupName,
      branchName,
      gitCli,
      defaultBranch,
    });

    const { diff } = await this.preCommitProcess({
      branchName,
      gitCli,
    });

    const sha = await gitCli.commit(branchName, commitMessage, preparedFiles);
    this.logger.debug("New commit added", { sha });

    if (diff) {
      const diffFolder = normalize(
        join(
          `.amplication/diffs`,
          this.provider.name,
          owner,
          repositoryName,
          v4()
        )
      );
      await this.postCommitProcess({
        diffFolder,
        diff,
        gitCli,
      });
    }

    const existingPullRequest = await this.provider.getPullRequest({
      owner,
      repositoryName,
      repositoryGroupName,
      branchName,
    });

    let pullRequest = existingPullRequest;

    if (!pullRequest) {
      pullRequest = await this.provider.createPullRequest({
        owner,
        repositoryName,
        repositoryGroupName,
        pullRequestTitle: accumulativePullRequestTitle,
        pullRequestBody: accumulativePullRequestBody,
        branchName,
        defaultBranchName: defaultBranch,
      });
    }

    if (sha) {
      await this.provider.createPullRequestComment({
        where: {
          issueNumber: pullRequest.number,
          owner,
          repositoryName,
          repositoryGroupName,
        },
        data: { body: pullRequestBody },
      });
    }

    return pullRequest.url;
  }

  /**
   * Returns git commits by amplication author
   * @param gitCli Git client
   * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
   */
  private async gitLog(
    gitCli: GitCli,
    maxCount = -1
  ): Promise<{
    amplicationGitUser: LogResult;
    amplicationBot: LogResult | null;
  }> {
    const amplicationBot = await this.provider.getAmplicationBotIdentity();

    let lastAmplicationBotCommitOnBranch: LogResult | null = null;

    if (amplicationBot) {
      lastAmplicationBotCommitOnBranch = await gitCli.log(
        amplicationBot.gitAuthor,
        maxCount
      );
    }

    const lastAmplicationGitUserCommitOnBranch = await gitCli.log(
      gitCli.gitAuthorUser,
      maxCount
    );

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
    gitCli,
    branchName,
  }: PreCommitProcessArgs): PreCommitProcessResult {
    this.logger.info("Pre commit process");
    await gitCli.checkout(branchName);

    const gitLogs = await this.gitLog(gitCli, 1);
    if (
      (!gitLogs.amplicationGitUser || !gitLogs.amplicationGitUser.latest) &&
      (!gitLogs.amplicationBot || !gitLogs.amplicationBot.latest)
    ) {
      this.logger.info(
        "Didn't find a commit that has been created by Amplication"
      );
      return { diff: null };
    }

    const hash =
      gitLogs.amplicationGitUser.latest?.hash ||
      gitLogs.amplicationBot?.latest?.hash;
    if (!hash) {
      this.logger.warn("Didn't find a commit hash");
      return { diff: null };
    }

    const diff = await gitCli.diff(hash);
    if (!diff) {
      this.logger.warn("Diff returned empty");
      return { diff: null };
    }

    // Reset the branch to the latest commit of the user / bot
    await gitCli.reset([hash]);
    await gitCli.push(["--force"]);
    this.logger.info("Diff returned");
    return { diff };
  }

  /**
   * @param diff File containing the git diff
   * @param diffFolder Location where the git patch will be generated
   * @param gitCli
   */
  private async postCommitProcess({
    diff,
    diffFolder,
    gitCli,
  }: PostCommitProcessArgs) {
    await mkdir(diffFolder, { recursive: true });
    const diffPatchRelativePath = join(diffFolder, "diff.patch");
    await writeFile(diffPatchRelativePath, diff);
    const diffPatchAbsolutePath = resolve(diffPatchRelativePath);
    this.logger.debug("Saving diff patch", { diffPatchAbsolutePath });

    await gitCli.resetState();
    this.logger.debug("Applying diff patch", { diffPatchAbsolutePath });
    await gitCli.applyPatch(
      [diffPatchAbsolutePath],
      ["--3way", "--whitespace=nowarn"]
    );
    this.logger.debug("Deleting diff patch", { diffPatchAbsolutePath });
    await rm(diffPatchAbsolutePath);
  }

  private async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const {
      branchName,
      owner,
      repositoryName,
      gitCli,
      repositoryGroupName,
      defaultBranch,
    } = args;
    const branch = await this.provider.getBranch(args);
    if (branch) {
      return branch;
    }
    const firstCommitOnDefaultBranch =
      await this.provider.getFirstCommitOnBranch({
        owner,
        repositoryName,
        branchName: defaultBranch,
        repositoryGroupName,
      });

    if (firstCommitOnDefaultBranch === null) {
      throw new NoCommitOnBranch(defaultBranch);
    }

    const newBranch = await this.provider.createBranch({
      owner,
      branchName,
      repositoryName,
      repositoryGroupName,
      pointingSha: firstCommitOnDefaultBranch.sha,
    });

    const gitLogs = await this.gitLog(gitCli);

    await this.cherryPickCommits(
      { ...gitLogs.amplicationBot, ...gitLogs.amplicationGitUser },
      gitCli,
      branchName,
      firstCommitOnDefaultBranch
    );
    return newBranch;
  }

  private async cherryPickCommits(
    commitsFromLatest: LogResult,
    gitCli: GitCli,
    branchName: string,
    firstCommitOnDefaultBranch: Commit
  ) {
    await gitCli.resetState();
    await gitCli.checkout(branchName);

    for (let index = commitsFromLatest.total - 1; index >= 0; index--) {
      const commit = commitsFromLatest.all[index];
      if (firstCommitOnDefaultBranch.sha === commit.hash) {
        continue;
      }
      await gitCli.cherryPick(commit.hash);
    }

    await gitCli.push();
  }

  private async manageAmplicationIgnoreFile(
    owner: string,
    repositoryName: string,
    repositoryGroupName?: string,
    gitRef?: string
  ) {
    const amplicationIgnoreManger = new AmplicationIgnoreManger();
    await amplicationIgnoreManger.init(async (fileName) => {
      try {
        const file = await this.provider.getFile({
          owner,
          repositoryName,
          repositoryGroupName,
          path: fileName,
          ref: gitRef,
        });
        if (!file) {
          return "";
        }
        const { content, htmlUrl, name } = file;
        this.logger.info(`Got ${name} file ${htmlUrl}`);
        return content;
      } catch (error) {
        this.logger.warn(
          "Repository does not have a .amplicationignore file",
          error
        );
        return "";
      }
    });
    return amplicationIgnoreManger;
  }

  private async createInitialCommit(args: {
    repositoryName: string;
    gitCli: GitCli;
    gitRepoDir: string;
    defaultBranch: string;
  }) {
    const { gitCli, repositoryName, gitRepoDir, defaultBranch } = args;
    const defaultREADMEFile = getDefaultREADMEFile(repositoryName);
    const foldersToIgnore = [".git"];
    if ((await isFolderEmpty(gitRepoDir, foldersToIgnore)) === false) {
      throw new Error(
        "The repository is not empty, crash the pull request logic to prevent data loss"
      );
    }
    await gitCli.commit(defaultBranch, "Initial commit", [
      {
        path: "README.md",
        content: defaultREADMEFile,
        skipIfExists: true,
        deleted: false,
      },
    ]);
  }

  private async isHaveFirstCommitInDefaultBranch(args: {
    owner: string;
    repositoryName: string;
    repositoryGroupName?: string;
    defaultBranch: string;
  }): Promise<boolean> {
    const { owner, repositoryName, repositoryGroupName, defaultBranch } = args;
    const defaultBranchFirstCommit = await this.provider.getFirstCommitOnBranch(
      {
        branchName: defaultBranch,
        owner,
        repositoryName,
        repositoryGroupName,
      }
    );

    return Boolean(defaultBranchFirstCommit);
  }
}
