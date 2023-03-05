import { CleanOptions, simpleGit, SimpleGit } from "simple-git";

export class GitClient {
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
}
