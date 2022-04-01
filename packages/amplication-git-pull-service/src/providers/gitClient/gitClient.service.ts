import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit from "simple-git";
import { CustomError } from "../../errors/CustomError";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
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
      simpleGit({
        binary: "git",
        maxConcurrentProcesses: 6,
      }).clone(
        // TODO:
        //  1. clone commit
        //  2. filter out assets
        `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`,
        baseDir,
        ["--branch", branch]
      );
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
      simpleGit({
        baseDir,
        binary: "git",
        maxConcurrentProcesses: 6,
      }).pull(remote, branch);
    } catch (err) {
      throw new CustomError("failed to pull a repository", err);
    }
  }
}
