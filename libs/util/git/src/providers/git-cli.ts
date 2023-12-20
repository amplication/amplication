import {
  CleanOptions,
  LogResult,
  ResetMode,
  simpleGit,
  SimpleGit,
} from "simple-git";
import { Commit, UpdateFile } from "../types";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { ILogger } from "@amplication/util/logging";
import { GitCliOptions } from "./git-cli.types";

export class GitCli {
  private git: SimpleGit;
  private isCloned = false;

  private gitAuthorUserName = "amplication[bot]";
  private gitAuthorUserEmail = "bot@amplication.com";
  private gitAuthorUserOldEmail =
    "100755160+amplication[bot]@users.noreply.github.com";
  public gitAuthorUser = `${this.gitAuthorUserName} <${this.gitAuthorUserEmail}>`;
  public gitOldAuthorUser = `${this.gitAuthorUserName} <${this.gitAuthorUserOldEmail}>`;

  private gitConflictsResolverAuthor = `amplication[branch whisperer] <${this.gitAuthorUserEmail}>`;

  constructor(
    private readonly logger: ILogger,
    private readonly options: GitCliOptions
  ) {
    this.git = simpleGit({
      config: [
        `user.name=${this.gitAuthorUserName}`,
        `user.email=${this.gitAuthorUserEmail}`,
        `push.autoSetupRemote=true`,
        `safe.directory=${options.repositoryDir}`,
      ],
    });
  }

  private async add(files?: string | string[]) {
    return this.git.add(files ?? ["."]);
  }

  async applyPatch(patches: string[], options?: string[]) {
    options = options ?? ["--index", "--3way", "--whitespace=nowarn"];

    this.logger.debug(`Applying patches`, { patches, options });
    await this.git.applyPatch(patches, options);
    this.logger.debug(`Committing Amplication merge conflicts auto-resolution`);
    await this.git.commit(
      "Amplication merge conflicts auto-resolution",
      undefined,
      {
        "--author": this.gitConflictsResolverAuthor,
      }
    );
    this.logger.debug(`Pushing Amplication merge conflicts auto-resolution`);
    await this.push();
  }

  /**
   * Checkout to branch if exists, otherwise create new branch
   * @param branchName name of the branch to checkout
   */
  async checkout(branchName: string): Promise<void> {
    await this.git.fetch();
    const remoteBranches = await this.git.branch(["--remotes"]);
    const remoteOriginBranchName = `origin/${branchName}`;
    if (!remoteBranches.all.includes(remoteOriginBranchName)) {
      await this.git.checkoutLocalBranch(branchName);
    } else {
      await this.git.checkout(branchName);
    }
  }

  async cherryPick(sha: string) {
    await this.git.raw([
      "cherry-pick",
      "-m 1",
      "--strategy=ort",
      "-X",
      "theirs",
      "-X",
      "find-renames=1",
      sha,
    ]);
  }

  async cherryPickAbort() {
    await this.git.raw(["cherry-pick", "--abort"]);
  }

  async commit(
    branchName: string,
    message: string,
    files: UpdateFile[]
  ): Promise<string> {
    await this.checkout(branchName);

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(this.options.repositoryDir, file.path);
        const fileParentDir = dirname(filePath);

        if (file.deleted) {
          await rm(filePath);
          return filePath;
        }

        if (!existsSync(filePath)) {
          await mkdir(fileParentDir, { recursive: true });
          await writeFile(filePath, file.content ?? "");
          return filePath;
        } else if (!file.skipIfExists) {
          await mkdir(fileParentDir, { recursive: true });
          await writeFile(filePath, file.content ?? "");
          return filePath;
        }
      })
    );

    await this.add(["."]);

    const status = await this.git.status();
    if (status.staged.length + status.renamed.length > 0) {
      const { commit: commitSha } = await this.git.commit(message);
      await this.push();
      return commitSha;
    } else {
      this.logger.warn(`Trying to commit empty changeset`, { status });
    }
    return "";
  }

  /**
   * Clones the repository if not already cloned and sets the working directory to the repository directory.
   * It performs a clone with the following options:
   * --no-checkout - Do not checkout the HEAD after cloning is complete
   * --filter=blob:none - Do not checkout blobs during clone
   * @see https://git-scm.com/docs/git-clone
   */
  async clone(): Promise<void> {
    if (!this.isCloned) {
      await this.git.clone(this.options.originUrl, this.options.repositoryDir, [
        "--no-checkout",
        "--filter=blob:none",
      ]);
      this.isCloned = true;
    }
    await this.git.cwd(this.options.repositoryDir);
    return;
  }

  async deleteRepositoryDir() {
    if (this.isCloned || existsSync(this.options.repositoryDir)) {
      await rm(this.options.repositoryDir, {
        recursive: true,
        force: true,
        maxRetries: 3,
      }).catch((error) => {
        this.logger.error(`Failed to delete repository dir`, error, {
          repositoryDir: this.options.repositoryDir,
        });
      });
      this.isCloned = false;
    }
  }

  /**
   * Returns the diff between the current branch and the given ref
   * @param ref reference to compare to
   * @returns diff between the current branch and the given ref
   * @see https://git-scm.com/docs/git-diff
   */
  async diff(ref: string) {
    return this.git.diff(["--full-index", ref]);
  }

  async getEdgeCommitSha(
    branchName: string,
    firstCommit: boolean
  ): Promise<Commit | null> {
    const originalStatus = await this.git.status();

    await this.checkout(branchName);
    let commit: string | undefined;
    try {
      const log = firstCommit
        ? await this.git.log(["--reverse"])
        : await this.git.log();
      commit = log.latest?.hash;
    } catch (error) {
      // If there are no commits in the branch, the log command will fail
    }

    try {
      if (originalStatus.current) {
        await this.git.checkout(originalStatus.current);
      }
    } catch (error) {
      this.logger.error(`Failed to checkout original branch`, error, {
        originalBranch: originalStatus.current,
      });
    }
    return commit ? { sha: commit } : null;
  }

  async getFirstCommitSha(branchName: string): Promise<Commit | null> {
    return await this.getEdgeCommitSha(branchName, true);
  }

  async getLastCommitSha(branchName: string): Promise<Commit | null> {
    return await this.getEdgeCommitSha(branchName, false);
  }

  /**
   * Returns git commits by amplication author
   * @param author Author of commits returned by the log
   * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
   */
  async log(authors: string[], maxCount?: number): Promise<LogResult> {
    const author = authors.join("|");
    const authorEscaped = author
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("+", "\\+");

    const authorsRegex = `^(${authorEscaped})$`;

    maxCount = maxCount ?? -1;
    return this.git.log([
      "--perl-regexp",
      `--author=${authorsRegex}`,
      `--max-count=${maxCount}`,
    ]);
  }

  async push(options?: string[]) {
    return this.git.push(options);
  }

  async reset(options: string[], mode: ResetMode = ResetMode.HARD) {
    return this.git.reset(mode, options);
  }

  async resetState() {
    await this.git.reset(ResetMode.HARD).clean(CleanOptions.FORCE);
  }
}
