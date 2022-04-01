import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit, { SimpleGitOptions } from "simple-git";
import { CustomError } from "../../errors/CustomError";
import * as fs from "fs";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  options: Partial<SimpleGitOptions> = {
    binary: "git",
    maxConcurrentProcesses: 6,
    timeout: {
      block: 4000,
    },
    completion: {
      onExit: 50,
      onClose: true,
    },
  };

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
      simpleGit({ ...this.options, baseDir })
        // TODO: filter out assets
        .clone(repository, baseDir, ["--branch", branch]);
    } catch (err) {
      throw new CustomError("failed to clone a repository", err);
    }
  }

  // TODO:
  //  1. check if need to add destroy (maxConcurrentProcesses)
  //  2. check if we can work with x amount of clients
  async pull(
    remote: string,
    branch: string,
    commit: string,
    baseDir: string
  ): Promise<void> {
    try {
      simpleGit({ ...this.options, baseDir }).pull(remote, branch);
      // .fetch(remote, branch)
      // .merge([commit])
    } catch (err) {
      throw new CustomError("failed to pull a repository", err);
    }
  }
}
