import { CleanOptions, ResetMode, simpleGit, SimpleGit } from "simple-git";
import { UpdateFile } from "../types";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { ILogger } from "@amplication/util/logging";

export class GitCli {
  private git: SimpleGit;
  private isCloned = false;

  private gitAuthorUserName = "amplication[bot]";
  private gitAuthorUserEmail = "bot@amplication.com";
  public gitAuthorUser = `${this.gitAuthorUserName} <${this.gitAuthorUserEmail}>`;
  private gitConflictsResolverAuthor = `amplication[branch whisperer] <${this.gitAuthorUserEmail}>`;

  constructor(
    private readonly logger: ILogger,
    private readonly repositoryDir: string
  ) {
    this.git = simpleGit({
      config: [
        `user.name=${this.gitAuthorUserName}`,
        `user.email=${this.gitAuthorUserEmail}`,
        `push.autoSetupRemote=true`,
        `safe.directory=${repositoryDir}`,
      ],
    });
  }

  async clone(cloneUrl: string): Promise<void> {
    if (!this.isCloned) {
      await this.git.clone(cloneUrl, this.repositoryDir, ["--no-checkout"]);
      this.isCloned = true;
    }
    await this.git.cwd(this.repositoryDir);
    return;
  }

  async deleteRepositoryDir() {
    if (this.isCloned || existsSync(this.repositoryDir)) {
      await rm(this.repositoryDir, {
        recursive: true,
        force: true,
        maxRetries: 3,
      }).catch((error) => {
        this.logger.error(`Failed to delete repository dir`, error, {
          repositoryDir: this.repositoryDir,
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
    await this.git
      .fetch(["--all"])
      .pull()
      .reset(ResetMode.HARD)
      .clean(CleanOptions.FORCE);
  }

  async diff(ref: string[]) {
    return this.git.diff(ref);
  }

  async commit(
    branchName: string,
    message: string,
    files: UpdateFile[]
  ): Promise<string> {
    await this.checkout(branchName);

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(this.repositoryDir, file.path);
        const fileParentDir = filePath.split("/").slice(0, -1).join("/");

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

    await this.git.add(["."]);

    const status = await this.git.status();
    if (status.staged.length !== 0) {
      const { commit: commitSha } = await this.git.commit(message);
      await this.git.push();
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
    options = options ?? ["--3way", "--whitespace=nowarn"];
    await this.git
      .applyPatch(patches, options)
      .commit("Amplication merge conflicts auto-resolution", undefined, {
        "--author": this.gitConflictsResolverAuthor,
      })
      .push();
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
