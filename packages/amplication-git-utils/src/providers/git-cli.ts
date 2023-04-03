import { CleanOptions, CommitResult, simpleGit, SimpleGit } from "simple-git";

export class GitCli {
  git: SimpleGit;

  constructor(private readonly repositoryDir: string) {
    this.git = simpleGit();
  }

  async clone(cloneUrl: string): Promise<void> {
    await this.git.clone(cloneUrl, this.repositoryDir, ["--no-checkout"]);
    await this.git.cwd(this.repositoryDir);
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
    await this.git.add("./*");

    const { commit: commitSha } = await this.git.commit(message, filesPath, {
      "--author": author,
    });
    return commitSha;
  }

  async push() {
    return this.push();
  }
}
