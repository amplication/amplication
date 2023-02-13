import { simpleGit, SimpleGit } from "simple-git";

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
}
