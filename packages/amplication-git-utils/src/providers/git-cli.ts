import { CleanOptions, ResetMode, simpleGit, SimpleGit } from "simple-git";
import { UpdateFile } from "../types";
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
  public gitAuthorUser = `${this.gitAuthorUserName} <${this.gitAuthorUserEmail}>`;
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

  async cherryPick(sha: string) {
    await this.git.raw([
      "cherry-pick",
      "-m 1",
      "--strategy=recursive",
      "-X",
      "theirs",
      sha,
    ]);
  }

  /**
   * Checkout to branch if exists, otherwise create new branch
   * @param branchName name of the branch to checkout
   */
  async checkout(branchName: string): Promise<void> {
    const remoteBranches = await this.git.branch(["--remotes"]);
    const remoteOriginBranchName = `origin/${branchName}`;
    if (!remoteBranches.all.includes(remoteOriginBranchName)) {
      await this.git.checkoutLocalBranch(branchName);
    } else {
      await this.git.checkout(branchName);
    }
  }

  async resetState() {
    await this.git.reset(ResetMode.HARD).clean(CleanOptions.FORCE);
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
    if (status.staged.length !== 0) {
      const { commit: commitSha } = await this.git.commit(message);
      await this.push();
      return commitSha;
    } else {
      this.logger.warn(`Trying to commit empty changeset`, { status });
    }
    return "";
  }

  async reset(options: string[], mode: ResetMode = ResetMode.HARD) {
    return this.git.reset(mode, options);
  }

  async push(options?: string[]) {
    return this.git.push(options);
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

  private async add(files?: string | string[]) {
    return this.git.add(files ?? ["."]);
  }

  /**
   * Returns git commits by amplication author
   * @param author Author of commits returned by the log
   * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
   */
  async log(author: string, maxCount?: number) {
    const authorEscaped = author.replaceAll("[", "\\[").replaceAll("]", "\\]");

    maxCount = maxCount ?? -1;
    return this.git.log({
      "--author": authorEscaped,
      "--max-count": maxCount,
    });
  }
}
