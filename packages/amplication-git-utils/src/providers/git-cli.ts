import { CleanOptions, simpleGit, SimpleGit } from "simple-git";
import { UpdateFile } from "../types";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

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
    files: UpdateFile[],
    author: string
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

        if (!file.skipIfExists) {
          await mkdir(fileParentDir, { recursive: true });
          await writeFile(filePath, file.content ?? "");
          return filePath;
        }
      })
    );

    await this.git.add(["."]);
    const { commit: commitSha } = await this.git.commit(message, {
      "--author": author,
    });
    return commitSha;
  }

  async push() {
    return this.git.push();
  }

  // /**
  //  * Returns git commits by amplication author
  //  * @param author Author of commits returned by the log
  //  * @param maxCount Limit the number of commits to output. Negative numbers denote no upper limit
  //  */
  // async log(author: string, maxCount?: number) {
  //   maxCount = maxCount ?? -1;
  //   return this.git.log({
  //     "--author": author,
  //     "--max-count": maxCount,
  //   });
  // }
}
