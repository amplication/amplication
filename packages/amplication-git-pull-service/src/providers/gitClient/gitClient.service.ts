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

  clone(cloneParams: ICloneParams, baseDir: string, accessToken: string): void {
    const { owner, repository } = cloneParams;
    this.git.clone(
      `https://${owner}:${accessToken}@github.com/${owner}/${repository}`,
      baseDir
    );
  }

  pull(pullParams: IPullParams): void {
    const { remote, branch } = pullParams;
    this.git.pull(remote, branch);
  }
}
