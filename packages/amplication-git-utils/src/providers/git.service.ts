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
  OAuth2FlowResponse,
} from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { prepareFilesForPullRequest } from "../utils/prepare-files-for-pull-request";
import { GitClient } from "./git-client";
import { GitFactory } from "./git-factory";
import { ILogger } from "@amplication/util/logging";

export class GitClientService {
  private provider: GitProvider;
  private logger: ILogger;

  async create(
    gitProviderArgs: GitProviderArgs,
    logger: ILogger
  ): Promise<GitClientService> {
    this.provider = await GitFactory.getProvider(gitProviderArgs, logger);
    this.logger = logger;
    return this;
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.provider.getGitInstallationUrl(amplicationWorkspaceId);
  }

  async completeOAuth2Flow(
    authorizationCode: string
  ): Promise<OAuth2FlowResponse> {
    return this.provider.completeOAuth2Flow(authorizationCode);
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

      const diffFolder = normalize(
        join(
          `.amplication/diffs`,
          this.provider.name,
          owner,

          repositoryName,
          randomUUID
        )
      );

      const { diff } = await this.preCommitProcess({
        branchName,
        gitClient,
        owner,
        repositoryName,
      });

      await this.provider.createCommit({
        owner,
        repositoryName,
        commitMessage,
        branchName,
        files: preparedFiles,
      });

      if (diff) {
        await mkdir(diffFolder, { recursive: true });
        const diffPath = join(diffFolder, "diff.patch");
        await writeFile(diffPath, diff);
        const fullDiffPath = resolve(diffPath);
        this.logger.info(`Saving diff to: ${fullDiffPath}`);
        await this.postCommitProcess({
          diffPath: fullDiffPath,
          gitClient,
        });
        await rm(fullDiffPath);
      }

      await rm(cloneDir, { recursive: true, force: true });

      const { defaultBranch } = await this.provider.getRepository({
        owner,
        repositoryName,
      });

      const existingPullRequest = await this.provider.getPullRequestForBranch({
        owner,
        repositoryName,
        branchName,
      });

      let pullRequest = existingPullRequest;

      if (!pullRequest) {
        pullRequest = await this.provider.createPullRequestForBranch({
          owner,
          repositoryName,
          pullRequestTitle: accumulativePullRequestTitle,
          pullRequestBody: accumulativePullRequestBody,
          branchName,
          defaultBranchName: defaultBranch,
        });
      }

      await this.provider.commentOnPullRequest({
        where: { issueNumber: pullRequest.number, owner, repositoryName },
        data: { body: pullRequestBody },
      });

      return pullRequest.url;
    }

    throw new InvalidPullRequestMode();
  }

  private async preCommitProcess({
    gitClient,
    branchName,
    owner,
    repositoryName,
  }: PreCommitProcessArgs): PreCommitProcessResult {
    this.logger.info("Pre commit process");
    await gitClient.git.checkout(branchName);

    const commitsList = await this.provider.getCurrentUserCommitList({
      branchName,
      owner,
      repositoryName,
    });

    const latestCommit = commitsList[0];

    if (!latestCommit) {
      this.logger.info(
        "Didn't find a commit that has been created by Amplication"
      );
      return { diff: null };
    }

    const { sha } = latestCommit;
    const diff = await gitClient.git.diff([sha]);
    if (diff.length === 0) {
      this.logger.info("Diff returned empty");
      return { diff: null };
    }
    // Reset the branch to the latest commit
    await gitClient.git.reset([sha]);
    await gitClient.git.push(["--force"]);
    await gitClient.resetState();
    this.logger.info("Diff returned");
    return { diff };
  }

  async postCommitProcess({ diffPath, gitClient }: PostCommitProcessArgs) {
    await gitClient.resetState();
    await gitClient.git
      .applyPatch(diffPath, ["--3way", "--whitespace=nowarn"])
      .add(["."])
      .commit("Amplication diff restoration", undefined, {
        "--author": "Amplication diff <info@amplication.com>",
      })
      .push();
  }

  private async restoreAmplicationBranchIfNotExists(
    args: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    const { branchName, owner, repositoryName, gitClient } = args;
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
      });
    const newBranch = await this.provider.createBranch({
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
    await this.cherryPickCommits(
      amplicationCommits,
      gitClient,
      branchName,
      firstCommitOnDefaultBranch
    );
    return newBranch;
  }

  private async cherryPickCommits(
    commits: Commit[],
    gitClient: GitClient,
    branchName: string,
    firstCommitOnDefaultBranch: Commit
  ) {
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
