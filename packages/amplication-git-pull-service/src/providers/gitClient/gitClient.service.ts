import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { CustomError } from "../../errors/CustomError";
import * as fs from "fs";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  git: SimpleGit;

  constructor() {
    // TODO:
    //  1. check if need to add destroy (maxConcurrentProcesses)
    //  2. check if we can work with x amount of clients
    const options: Partial<SimpleGitOptions> = {
      binary: "git",
      maxConcurrentProcesses: 6,
      timeout: {
        block: 2000,
      },
      completion: {
        onExit: 50,
        onClose: true,
      },
    };

    this.git = simpleGit(options);
  }

  async clone(
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    pushedAt: Date,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): Promise<void> {
    try {
      // baseDir => `${os.homedir()}/git-remote/${repositoryOwner}/${repositoryName}/${branch}/${commit}`;
      fs.mkdirSync(baseDir, { recursive: true });
      const repository = `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`;
      // TODO: filter out assets
      this.git
        .clone(repository, baseDir, ["--branch", branch])
        .cwd(baseDir)
        .checkout(commit);
    } catch (err) {
      throw new CustomError("failed to clone a repository", err);
    }
  }

  async pull(
    remote: string,
    branch: string,
    commit: string,
    baseDir: string
  ): Promise<void> {
    try {
      this.git.cwd(baseDir).fetch(remote, branch).merge([commit]);
    } catch (err) {
      throw new CustomError("failed to pull a repository", err);
    }
  }
}
