import { Injectable } from "@nestjs/common";
import {
  ICloneParams,
  IGitClient,
  IPullParams,
} from "../../contracts/gitClient.interface";
import simpleGit, { SimpleGit } from "simple-git";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit({
      binary: "git",
      maxConcurrentProcesses: 6,
    });
  }

  clone(
    cloneParams: ICloneParams,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): void {
    const { repositoryOwner, repositoryName } = cloneParams;
    this.git.clone(
      `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`,
      baseDir
    );
  }

  pull(pullParams: IPullParams): void {
    const { remote, branch } = pullParams;
    /* TODO: figure out how to pass here the baseDir and the accessToken => simpleGit({//options//}) */
    this.git.pull(remote, branch);
  }
}
