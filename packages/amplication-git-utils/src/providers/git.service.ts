import { mkdir, rm, writeFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { v4 } from "uuid";
import {
  accumulativePullRequestBody,
  accumulativePullRequestTitle,
} from "../constants";
import { InvalidPullRequestMode } from "../errors/InvalidPullRequestMode";
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
import { GitCli } from "./git-cli";
import { GitFactory } from "./git-factory";
import { ILogger } from "@amplication/util/logging";
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
      const randomUUID = v4();
      const gitRepoDir = normalize(
        join(
          createPullRequestArgs.cloneDirPath,
          this.provider.name,
          owner,
          repositoryName,
          randomUUID
        )
      );

      const gitCli = new GitCli(gitRepoDir);

      const cloneToken = await this.provider.getToken();

      const cloneUrl = this.provider.getCloneUrl({
        owner,
        repositoryName,
        token: cloneToken,
        gitGroupName,
      });

      await gitCli.clone(cloneUrl);

      await this.restoreAmplicationBranchIfNotExists({
        owner,
        repositoryName,
        branchName,
        gitCli,
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
            randomUUID
          )
        );
        await this.postCommitProcess({
          diffFolder,
          diff,
          gitCli,
        });
      }

      await rm(gitRepoDir, { recursive: true, force: true });

      const { defaultBranch } = await this.provider.getRepository({
        owner,
        repositoryName,
      });

      const existingPullRequest = await this.provider.getPullRequest({
        owner,
        repositoryName,
        branchName,
        gitGroupName,
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

      await this.provider.createPullRequestComment({
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
        `${amplicationBot.login} <`,
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

    const diff = await gitCli.diff([hash]);
    if (!diff) {
      this.logger.warn("Diff returned empty");
      return { diff: null };
    }

    // Reset the branch to the latest commit of the user / bot
    await gitCli.reset([hash]);
    await gitCli.push(["--force"]);
    await gitCli.resetState();
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
    this.logger.info(`Saving diff to: ${diffPatchAbsolutePath}`);

    await gitCli.resetState();
    await gitCli.applyPatch(
      [diffPatchAbsolutePath],
      ["--3way", "--whitespace=nowarn"]
    );

    await rm(diffPatchAbsolutePath);
  }

  private async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const { branchName, owner, repositoryName, gitCli, gitGroupName } = args;
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
