import { ILogger } from "@amplication/util/logging";
import { mkdir, rm, writeFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { v4 } from "uuid";
import {
  accumulativePullRequestBody,
  accumulativePullRequestTitle,
  getDefaultREADMEFile,
} from "./constants";
import { InvalidPullRequestMode } from "./errors/InvalidPullRequestMode";
import { NoCommitOnBranch } from "./errors/NoCommitOnBranch";
import { GitProvider } from "./git-provider.interface";
import {
  Branch,
  CreateBranchIfNotExistsArgs,
  CreatePullRequestArgs,
  CreateRepositoryArgs,
  EnumPullRequestMode,
  GetRepositoriesArgs,
  GitProviderArgs,
  PostCommitProcessArgs,
  CalculateDiffAndResetBranchArgs,
  CalculateDiffAndResetBranchResult,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  GetRepositoryArgs,
  PaginatedGitGroup,
  GitProvidersConfiguration,
  CurrentUser,
  OAuthTokens,
  UpdateFile,
} from "./types";
import { AmplicationIgnoreManger } from "./utils/amplication-ignore-manger";
import { isFolderEmpty } from "./utils/is-folder-empty";
import { prepareFilesForPullRequest } from "./utils/prepare-files-for-pull-request";
import { GitCli } from "./providers/git-cli";
import { GitFactory } from "./git-factory";
import { LogResult } from "simple-git";
import { TraceWrapper } from "@amplication/opentelemetry-nestjs";
import { isEmpty } from "lodash";
import { InvalidBaseBranch } from "./errors/InvalidBaseBranch";

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
      baseBranchName,
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

    const gitCli = TraceWrapper.trace(
      new GitCli(this.logger, {
        originUrl: cloneUrl,
        repositoryDir: gitRepoDir,
      }),
      { logger: this.logger }
    );

    try {
      let baseBranch: string;

      //if not base branch name is provided, use the default branch of the repository
      if (isEmpty(baseBranchName)) {
        const repo = await this.provider.getRepository({
          owner,
          repositoryName,
          groupName: repositoryGroupName,
        });
        baseBranch = repo.defaultBranch;
      } else {
        baseBranch = baseBranchName;

        const branch = await this.provider.getBranch({
          owner,
          repositoryName,
          branchName: baseBranch,
          repositoryGroupName,
        });

        if (!branch) {
          throw new InvalidBaseBranch(baseBranch);
        }
      }

      await gitCli.clone();

      const firstCommitOnBaseBranch = await gitCli.getFirstCommitSha(
        baseBranch
      );

      //This is the first commit by Amplication on the base branch
      if (!firstCommitOnBaseBranch) {
        await this.createInitialCommit({
          gitRepoDir,
          gitCli,
          repositoryName,
          branchName: baseBranch,
        });
      }

      const amplicationIgnoreManger = await this.manageAmplicationIgnoreFile(
        owner,
        repositoryName,
        repositoryGroupName,
        baseBranch
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
            baseBranch,
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
    baseBranch: string;
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
      baseBranch,
      repositoryGroupName,
    } = options;

    await gitCli.clone();
    await this.restoreAmplicationBranchIfNotExists({
      owner,
      repositoryName,
      repositoryGroupName,
      branchName,
      gitCli,
      baseBranch,
    });

    // calculate diff on everything *already existing* on the amplication branch since last amplication build
    const preCommitDiff = await this.calculateDiffAndResetBranch({
      branchName,
      gitCli,
      useBeforeLastCommit: false,
    });

    // now commit the new build
    const sha = await gitCli.commit(branchName, commitMessage, preparedFiles);
    this.logger.debug("New commit added", { sha });

    // now calculate the diff (only) between the previous amplication build and the new one
    const postCommitDiff = await this.calculateDiffAndResetBranch({
      branchName,
      gitCli,
      useBeforeLastCommit: true,
    });

    // On top of the previous amplication build, apply the patch for the already existing changes that have been in this branch
    if (preCommitDiff.diff) {
      await this.applyPostCommit(
        preCommitDiff.diff,
        owner,
        repositoryName,
        gitCli
      );
    }
    // on top of the already existing changes, apply the diff between the previous amplication build and the new one
    if (postCommitDiff.diff) {
      await this.applyPostCommit(
        postCommitDiff.diff,
        owner,
        repositoryName,
        gitCli
      );
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
        baseBranchName: baseBranch,
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

  private async applyPostCommit(diff, owner, repositoryName, gitCli) {
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
  }

  /**
   * Returns git commits by amplication author
   * @param gitCli Git client
   * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
   */
  private async gitLog(gitCli: GitCli, maxCount = -1): Promise<LogResult> {
    const amplicationBot = await this.provider.getAmplicationBotIdentity();

    const authors: string[] = [];
    if (amplicationBot) {
      authors.push(amplicationBot.gitAuthor);
    }
    authors.push(gitCli.gitAuthorUser);
    authors.push(gitCli.gitOldAuthorUser);

    return gitCli.log(authors, maxCount);
  }

  /**
   * Return the git diff of the latest amplication commit in the branchName.
   * Return null when no amplication commits are found in the branch.
   */
  async calculateDiffAndResetBranch({
    gitCli,
    branchName,
    useBeforeLastCommit,
  }: CalculateDiffAndResetBranchArgs): CalculateDiffAndResetBranchResult {
    this.logger.info("Pre commit process");
    await gitCli.checkout(branchName);

    let hash = "";
    if (useBeforeLastCommit) {
      const gitLogs = await this.gitLog(gitCli, 2);
      if (gitLogs.total > 0) {
        hash = gitLogs.all[0].hash;
      }
    } else {
      const gitLogs = await this.gitLog(gitCli, 1);
      if (gitLogs.total > 0 && gitLogs.latest) {
        hash = gitLogs.latest.hash;
      }
    }
    if (hash != "") {
      const diff = await gitCli.diff(hash);
      if (!diff) {
        this.logger.warn("Diff returned empty");
        return { diff: null };
      }

      // Reset the branch to the latest commit of the user / bot
      this.logger.debug("preCommit - resetting branch ", { branchName, hash });
      await gitCli.reset([hash]);
      await gitCli.push(["--force"]);
      this.logger.info("Diff returned");
      return { diff };
    } else {
      this.logger.info(
        "Didn't find a commit that has been created by Amplication"
      );
      return { diff: null };
    }
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

  public async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const {
      branchName,
      owner,
      repositoryName,
      gitCli,
      repositoryGroupName,
      baseBranch,
    } = args;
    const branch = await this.provider.getBranch(args);
    if (branch) {
      return branch;
    }

    const firstCommitOnBaseBranch = await gitCli.getFirstCommitSha(baseBranch);

    if (firstCommitOnBaseBranch === null) {
      throw new NoCommitOnBranch(baseBranch);
    }

    let hash = firstCommitOnBaseBranch.sha;

    await gitCli.checkout(baseBranch);
    const gitLogs = await this.gitLog(gitCli, 1);
    if (gitLogs.total > 0 && gitLogs.latest) {
      hash = gitLogs.latest.hash;
    }

    const newBranch = await this.provider.createBranch({
      owner,
      branchName,
      repositoryName,
      repositoryGroupName,
      pointingSha: hash,
      baseBranchName: baseBranch,
    });

    return newBranch;
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
        const { content, path, name } = file;
        this.logger.info(`Got ${name} file ${path}`);
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
    branchName: string;
  }) {
    const { gitCli, repositoryName, gitRepoDir, branchName } = args;
    const defaultREADMEFile = getDefaultREADMEFile(repositoryName);
    const foldersToIgnore = [".git"];
    if ((await isFolderEmpty(gitRepoDir, foldersToIgnore)) === false) {
      throw new Error(
        "The repository is not empty, crash the pull request logic to prevent data loss"
      );
    }
    await gitCli.commit(branchName, "Initial commit", [
      {
        path: "README.md",
        content: defaultREADMEFile,
        skipIfExists: true,
        deleted: false,
      },
    ]);
  }
}
