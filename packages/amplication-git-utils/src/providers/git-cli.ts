import { CleanOptions, CommitResult, simpleGit, SimpleGit } from "simple-git";

export class GitCli {
  git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async clone(cloneUrl: string, cloneDir: string): Promise<void> {
    await this.git.clone(cloneUrl, cloneDir, ["--no-checkout"]);
    await this.git.cwd(cloneDir);
    return;
  }

  async cherryPick(sha: string) {
    await this.git.raw([
      `cherry-pick`,
      "-m 1",
      "--strategy=recursive",
      "-X",
      "theirs",
      sha,
    ]);
  }

  async checkout(branchName: string) {
    await this.git.checkout(branchName);
  }

  async resetState() {
    await this.git
      .fetch(["--all"])
      .pull()
      .reset(["--hard"])
      .clean(CleanOptions.FORCE);
  }

  async commit(
    branchName: string,
    message: string,
    filesPath: string[],
    author: string
  ): Promise<string> {
    await this.git.checkout(branchName);

    const { commit: commitSha } = await this.git.commit(message, filesPath, {
      "--author": author,
    });
    return commitSha;
  }
}
